
const Employee = require('../models/employee')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const signUp = async (req, res) => {
    const { username, email, password, designation } = req.body;
    try {
        const existingUser = await Employee.findOne({ email: email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exist" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const employee = await Employee.create({
            username,
            email: email.toLowerCase(),
            password: hashPassword,
            designation
        });

        const token = jwt.sign(
            { employee_id: employee._id, email: employee.email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );
        res.status(201).json({ employee: employee, token: token });
    } catch (error) {
        console.log(error);
    }
};

const signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await Employee.findOne({ email: email });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const matchPassword = await bcrypt.compare(password, existingUser.password);

        if (!matchPassword) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        const token = jwt.sign(
            { employee_id: existingUser._id, email: existingUser.email },
            process.env.TOKEN_KEY
        );
        res.status(201).json({ Employee: existingUser, token: token });
    } catch (error) {
        console.log(error);
    }
};

module.exports = { signIn, signUp };