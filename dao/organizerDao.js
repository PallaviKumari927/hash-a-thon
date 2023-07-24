const { StatusCodes } = require('http-status-codes')
const { catchAsync } = require('../middleware/errors')
const Organizer = require('../models/organizer')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const signUp = async (req, res) => {
    const { company_name, email, password, role } = req.body;

    try {
        const existingUser = await Organizer.findOne({ email: email });

        if (existingUser) {
            return res.status(StatusCodes.BAD_REQUEST).send(
                {
                    success: false,
                    message: 'Organizer already present',
                    data: existingUser
                })
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const organizer = await Organizer.create({
            company_name,
            email: email.toLowerCase(),
            password: hashPassword,
            role
        });

        const token = jwt.sign(
            { _id: organizer._id, name: organizer.name, email: organizer.email, role: organizer.role },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );
        res.status(StatusCodes.CREATED).send(
            {
                success: true,
                message: 'Organizer created Sucessfully',
                data: { organizer: organizer, token: token }

            });

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(
            {
                success: false,
                message: 'Something went wrong',
            });
    }
};

const signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await Organizer.findOne({ email: email });
        if (!existingUser) {
            return res.status(StatusCodes.NOT_FOUND).send(
                {
                    success: false,
                    message: existingUser && existingUser.length ? 'Organizer Found' : 'Organizer not found',
                    data: existingUser
                })
        }

        const matchPassword = await bcrypt.compare(password, existingUser.password);

        if (!matchPassword) {
            return res.status(StatusCodes.BAD_REQUEST).send(
                {
                    success: false,
                    message: 'Invalid Credentials',

                })
        }
        const token = jwt.sign(
            { _id: existingUser._id, email: existingUser.email, role: existingUser.role },
            process.env.TOKEN_KEY
        );
        res.status(StatusCodes.CREATED).send(
            {
                success: true,
                message: 'Organizer Login Sucessfully',
                data: [{ Organizer: existingUser, token: token }]
            });

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(
            {
                success: false,
                message: 'Something went wrong',
            });
    }
};
const getOrganizerByEmailDao = async (email) => {
    return await Organizer.find({
        email: email
    })

};
const updateOrganizerDao = async (req) => {
    return await Organizer.findOneAndUpdate(
        { email: req.user.email },
        req.body,
        { new: true }
    );
};

const deleteOrganizerDao = async (req) => {
    return await Organizer.findOneAndRemove({ email: req.user.email });
};

module.exports = {
    signIn,
    signUp,
    getOrganizerByEmailDao,
    updateOrganizerDao,
    deleteOrganizerDao
};
