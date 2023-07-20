const { signIn, signUp } = require('../dao/companyDao')

const signin = async(req, res) => {
    return await signIn(req, res)
}

const signup = async(req, res) => {
    return await signUp(req, res)
}
module.exports = { signin, signup };