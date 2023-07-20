const { getAllHackathon,addHackathon,deleteHackathon,updateHackathon } = require('../dao/hackathonDao')

const getAllHackathons = async(req, res) => {
    return await getAllHackathon(req, res)
}

const addHackathons = async(req, res) => {
    return await addHackathon(req, res)
}
const deleteHackathons = async(req, res) => {
    return await deleteHackathon(req, res)
}
const updateHackathons = async(req, res) => {
    return await updateHackathon(req, res)
}
module.exports = {  getAllHackathons,addHackathons,deleteHackathons,updateHackathons };