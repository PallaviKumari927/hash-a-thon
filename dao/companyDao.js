const Company = require('../models/company')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const signUp = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const existingUser = await Company.findOne({ email: email });
        if (existingUser) {
            return res.status(409).json({ message: "Company already exist" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const company = await Company.create({
            name,
            email: email.toLowerCase(),
            password: hashPassword,
            role
        });

        const token = jwt.sign(
            { _id: company._id, name: company.name,email: company.email,role: company.role },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );
        res.status(201).json({ company: company, token: token });
    } catch (error) {
        console.log(error);
    }
};

const signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await Company.findOne({ email: email });
        if (!existingUser) {
            return res.status(404).json({ message: "company not found" });
        }

        const matchPassword = await bcrypt.compare(password, existingUser.password);

        if (!matchPassword) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        const token = jwt.sign(
            { _id: existingUser._id, email: existingUser.email,role: existingUser.role},
            process.env.TOKEN_KEY
        );
        res.status(201).json({ Company: existingUser, token: token });
    } catch (error) {
        console.log(error);
    }
};
module.exports = {signIn,signUp};
