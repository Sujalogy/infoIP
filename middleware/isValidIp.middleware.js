const isValidIp = (req, res, next) => {
    const { ip } = req.params;

    const isRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    if(!isRegex.test(ip)) {
        res.status(400).json({ error: "Invalid IP address"});
    }
    next();
}

module.exports = {
    isValidIp
}