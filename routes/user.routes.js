const express = require('express');
const { userRegister, userLogin, userLogout } = require('../controller/user.controller');
const { getIPInfo } = require('../controller/ipInfo.controller');
const { auth } = require("../middleware/auth.middleware");
const { isValidIp } = require('../middleware/isValidIp.middleware');
const userRouter = express.Router();

userRouter.post('/register', userRegister);
userRouter.post("/login", userLogin);
userRouter.post("/logout", auth, userLogout);
userRouter.get("/ip-info/:ip",auth, isValidIp, getIPInfo)

module.exports = {
    userRouter
}