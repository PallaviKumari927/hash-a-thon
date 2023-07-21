const { getAllHackathon,addHackathon,deleteHackathon,updateHackathon,addParticipate,searchHackathon,getParticipate,getAllParticipate } = require('../dao/hackathonDao')

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
const addParticipates = async(req,res) => {
    return await addParticipate(req,res)
}
const searchHackathons = async(req,res) => {
    return await searchHackathon(req,res)
}
const getParticipates = async(req,res) => {
    return await getParticipate(req,res)
}
const getAllParticipates = async(req,res) => {
    console.log("hello")
    return await getAllParticipate(req,res)
}
module.exports = {  getAllHackathons,addHackathons,deleteHackathons,updateHackathons,addParticipates,searchHackathons,getParticipates,getAllParticipates };