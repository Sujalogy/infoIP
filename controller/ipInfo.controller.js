const http = require("http");
const { createLogger, transports } = require("winston");
const { redisClient } = require("../config/redis");
const { searchModel } = require("../models/ip.model");

const logger = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({ filename: "error.log", level: "error" }),
  ],
});

const fetchIpInfo = (ip) =>
  new Promise((resolve, reject) => {
    const options = {
      host: "ipapi.co",
      path: `/${ip}/json`,
      method: "GET",
      followRedirects: true,
    };
    const protocol = options.protocol === "https:" ? https : http;
    const req = protocol.request(options, (resp) => {
      let body = "";
      resp.on("data", function (data) {
        body += data;
      });
      resp.on("end", function () {
        if (resp.statusCode >= 200 && resp.statusCode < 300) {
          resolve(JSON.parse(body));
        } else {
          const errorMessage = `failed to fetch`;
          logger.error(errorMessage);
          reject(
            new Error("Failed to Fetch IP Info. StatusCode: " + resp.statusCode)
          );
        }
      });
    });

    req.on("error", (error) => {
      const errorMessage = `failed to fetch`;
      logger.error(errorMessage);
      reject(error);
    });

    req.end();
  });

const getIPInfo = async (req, res) => {
  const { ip } = req.params;
  try {
    const cachedData = await redisClient.get(ip);
    if (cachedData) {
      res.status(200).json(JSON.parse(cachedData));
    }
    const ipInfo = await fetchIpInfo(ip);

    await redisClient.set(ip, JSON.stringify(ipInfo), "EX", 6 * 60 * 60);
    const search = new searchModel({
      user: req.user._id,
      ip: ip,
      city: ipInfo.city,
    });
    await search.save();
    res.status(200).json(ipInfo);
  } catch (error) {
    const errorMessage = `failed to fetch`;
    logger.error(errorMessage);
    console.log(error.message);
    res
      .status(500)
      .json({ error: "An error occurred while getting Ip Info..." });
  }
};

module.exports = {
  getIPInfo,
};
