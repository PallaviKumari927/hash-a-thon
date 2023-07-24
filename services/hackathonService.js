const {
    getAllHackathon,
    addHackathon,
    deleteHackathon,
    updateHackathon,
    addParticipate,
    searchHackathon,
    getParticipate,
    getAllParticipate,
    getHackathonActiveDao,
    getHackathonPastDao,
    getHackathonUpcomingDao,
    getParticipateBasedOnFilterDao
} = require('../dao/hackathonDao')

const getAllHackathons = async (req, res) => {
    return await getAllHackathon(req, res)
}

const addHackathons = async (req, res) => {
    return await addHackathon(req, res)
}
const deleteHackathons = async (req, res) => {
    return await deleteHackathon(req, res)
}
const updateHackathons = async (req, res) => {
    return await updateHackathon(req, res)
}
const addParticipates = async (req, res) => {
    return await addParticipate(req, res)
}
const searchHackathons = async (req, res) => {
    return await searchHackathon(req, res)
}
const getParticipates = async (req, res) => {
    return await getParticipate(req, res)
}
const getAllParticipates = async (req, res) => {
    return await getAllParticipate(req, res)
}
const getHackathonActiveService = async (req, res) => {
    return await getHackathonActiveDao(req, res)
}
const getHackathonPastService = async (req, res) => {
    return await getHackathonPastDao(req, res)
}
const getHackathonUpcomingService = async (req, res) => {
    return await getHackathonUpcomingDao(req, res)
}
const getParticipateBasedOnFilterService = async (req, res) => {
    return await getParticipateBasedOnFilterDao(req, res)
}
module.exports = {
    getAllHackathons,
    addHackathons,
    deleteHackathons,
    updateHackathons,
    addParticipates,
    searchHackathons,
    getParticipates,
    getAllParticipates,
    getHackathonActiveService,
    getHackathonPastService,
    getHackathonUpcomingService,
    getParticipateBasedOnFilterService
};