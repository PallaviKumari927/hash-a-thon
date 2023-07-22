require('dotenv').config()
const express = require('express');
const app = express();
const router = express.Router();

const body_parser = require("body-parser");
const { sendError } = require('./middleware/errors.js');
const auth = require("./middleware/auth");


const PORT = process.env.PORT || 5000;
const connectDb = require("./database/config");

const employee = require('./routes/employee')
const hackathon = require('./routes/hackathon');
const organizer = require("./routes/organizer.js");
const authentication = require("./routes/auth");

app.use(router)
app.use(sendError)
app.use(body_parser.json());
app.use('/auth', auth)
app.use('/', authentication);
app.use("/auth/employee", employee);
app.use("auth/hackathon", hackathon);
app.use("/auth/organizer", organizer);

const start = async () => {
    try {
        await connectDb(process.env.DB_DATABASE);
        app.listen(PORT, () => {
            console.log(`${PORT}, Yes I am connected`);
        });
    }
    catch (error) {
        console.log(error);
    }
}

start();
module.exports = app