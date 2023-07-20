const {signin,signup} = require('../services/companyService')

const signIn = async(req,res) => {
    try{
    const data = await signin(req,res);
    res.status(200).send(data);
    }catch(error){
        res.status(500).send(error)
    }
};
const signUp = async(req,res) => {
    try{
    const data = await signup(req,res);
    res.status(200).send(data);
    }catch(error){
        res.status(500).send(error)
    }
};
module.exports = {signIn,signUp};