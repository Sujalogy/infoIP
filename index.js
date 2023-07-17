const express = require('express');

const { connection } = require('./database/db.database');
const { userRouter } = require('./routes/user.routes');
require("dotenv").config();

const app = express();

app.use(express.json());

app.use("/user", userRouter);

const port = process.env.PORT;
app.listen(port, async () => {
    try {
        console.log("server is running...");
        await connection
        console.log("DB connected");
    } catch (error) {
        console.log("Not Connected");
    }
})