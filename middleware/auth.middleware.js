const jwt = require("jsonwebtoken");
const { redisClient } = require("../config/redis");
require("dotenv").config();

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if(!token) {
            res.status(401).json({error: "token required"});
        }
        const isBlacklisted = await redisClient.get(token);
        if(isBlacklisted) {
            res.status(401).json({error: "Token is blacklisted"});
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decodedToken;
        next();
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error : "invalid token..."});
    }
}

module.exports = {
    auth
}