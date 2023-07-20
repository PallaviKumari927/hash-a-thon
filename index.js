const express = require('express');
require('dotenv').config()
const router = express.Router()
require("dotenv").config();
const app = express();
const body_parser = require("body-parser");

const PORT = process.env.PORT || 5000;
const employee = require('./routes/employee')
const connectDb = require("./database/config");
const hackathon = require('./routes/hackathon');
const auth = require("./middleware/auth");
app.use(router)
// require('./routes.js')(router)

app.use(body_parser.json());

app.use("/auth",employee);
app.use("/hackathon",auth,hackathon);
// app.use(sendError)
const start = async() => {
    try{
        await connectDb(process.env.DB_DATABASE);
        app.listen(PORT,() => {
            console.log(`${PORT}, Yes I am connected`);
        });
    }
    catch(error){
        console.log(error);
    }
}

start();
module.exports = app