const { signIn, signUp,getAllParticipatedHackathons } = require('../dao/employeeDao')

const signin = async(req, res) => {
    return await signIn(req, res)
}

const signup = async(req, res) => {
    return await signUp(req, res)
}
const getAllParticipatedhackathons = async(req,res) => {
    return await getAllParticipatedHackathons(req,res)
}
module.exports = { signin, signup,getAllParticipatedhackathons };