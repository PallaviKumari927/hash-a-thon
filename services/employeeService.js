const { signIn, signUp,getAllParticipatedHackathons,getEmployeeByEmailDao,updateEmployeeDao,deleteEmployeeDao } = require('../dao/employeeDao')

const signin = async(req, res) => {
    return await signIn(req, res)
}

const signup = async(req, res) => {
    return await signUp(req, res)
}
const getAllParticipatedhackathons = async(req,res) => {
    return await getAllParticipatedHackathons(req,res)
}
const getEmployeeByEmailService = async(email) => {
    return await getEmployeeByEmailDao(email)
};
const updateEmployeeService = async(req) => {
    return await updateEmployeeDao(req)
};
const deleteEmployeeService = async(req) => {
    return await deleteEmployeeDao(req)
}
module.exports = { signin, signup,getAllParticipatedhackathons,getEmployeeByEmailService,updateEmployeeService,deleteEmployeeService }