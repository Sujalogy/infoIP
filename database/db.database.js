require("dotenv").config();
const mongoose = require("mongoose");
const url = process.env.MongoURL;
const connection = mongoose.connect(url);

module.exports = {
    connection
}