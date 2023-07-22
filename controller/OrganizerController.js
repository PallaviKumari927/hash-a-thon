const { StatusCodes } = require('http-status-codes')
const { catchAsync } = require('../middleware/errors')
const {
    signin,
    signup,
    getOrganizerByEmailService,
    updateOrganizerService,
    deleteOrganizerService
} = require('../services/organizerService')

const organizerLogin = catchAsync(async (req, res) => {
    try {
        const data = await signin(req, res);
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send(error)
    }
});
const organizerSignUp = catchAsync(async (req, res) => {

    const data = await signup(req, res);
    // res.status(200).send(data);

});
const getOrganizerByEmail = catchAsync(async (req, res, next) => {
    const { email } = req.query

    const result = await getOrganizerByEmailService(email)

    res.status(StatusCodes.OK).send(
        {
            success: true,
            message: result && result.length ? 'Organizer Found' : 'Organizer not found with email ',
            data: result
        })

    next()
});
const updateOrganizer = catchAsync(async (req, res, next) => {

    const result = await updateOrganizerService(req)
    res.status(StatusCodes.OK).send(
        {
            success: true,
            message: result && result.length ? 'Organizer updated Sucessfully' : 'Organizer  not updated',
            data: result
        })

    next()
});
const deleteOrganizer = catchAsync(async (req, res) => {

    const result = await deleteOrganizerService(req);
    res.status(StatusCodes.OK).send(
        {
            success: true,
            message: result && result.length ? 'Organizer Deleted Sucessfully' : 'Organizer not Found',
            data: result
        })

});
module.exports = {
    organizerLogin,
    organizerSignUp,
    getOrganizerByEmail,
    updateOrganizer,
    deleteOrganizer
};