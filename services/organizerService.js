const {
    signIn,
    signUp,
    getOrganizerByEmailDao,
    updateOrganizerDao,
    deleteOrganizerDao
} = require('../dao/organizerDao')

const signin = async (req, res) => {
    return await signIn(req, res)
}

const signup = async (req, res) => {
    return await signUp(req, res)
}

const getOrganizerByEmailService = async (email) => {
    return await getOrganizerByEmailDao(email)
};
const updateOrganizerService = async (req) => {
    return await updateOrganizerDao(req)
};
const deleteOrganizerService = async (req) => {
    return await deleteOrganizerDao(req)
}
module.exports = {
    signin,
    signup,
    getOrganizerByEmailService,
    updateOrganizerService,
    deleteOrganizerService
};