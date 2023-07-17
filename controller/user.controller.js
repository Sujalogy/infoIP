const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { redisClient } = require("../config/redis");
const { UserModel } = require("../models/user.model");

// user Registration ----------
const userRegister = async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new UserModel({username, password : hashedPassword});
        await user.save();
        res.status(200).json({message : "User registered successfully"});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error : "Failed to register user"});
    }
}

// user Login ----------
const userLogin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await UserModel.findOne({username});
        if(!user) {
            res.status(401).json({error : "user not exist or invalid username"});
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            res.status(401).json({error : "invalid password"});
        }
        const token = jwt.sign({userId : user._id}, process.env.JWT_SECRET);
        res.status(200).json({message : "logged in successfully",token : token});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error : "Failed to login user"});
    }
};

// user Logout ----------
const userLogout = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if(token) {
            await redisClient.set(token, "blacklisted", "EX", 6 * 60 * 60);
        }
        res.status(200).json({message : "Logged Out Successfully"});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error : "Failed to logging out the user"});
    }
}

module.exports = {
    userRegister, userLogin, userLogout
}