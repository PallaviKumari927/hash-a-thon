const { StatusCodes } = require('http-status-codes')
const { catchAsync } = require('../middleware/errors')
const {
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
} = require('../services/hackathonService')


const getAllHackathon = catchAsync(async (req, res, next) => {

    const result = await getAllHackathons(req, res);
    res.status(StatusCodes.OK).send(
        {
            success: true,
            message: result && result.length ? 'Data Found' : 'Hackathon not found',
            data: result
        })

    next()
});

const addHackathon = catchAsync(async (req, res, next) => {

    const result = await addHackathons(req, res);
    res.status(StatusCodes.OK).send(
        {
            success: true,
            message: result && result.length ? 'Hackathon created sucessfully' : 'Hackathon not found',
            data: result
        })

    next()
});

const updateHackathon = catchAsync(async (req, res) => {
    try {
        const updateHackathon = await updateHackathons(req, res);
        res.status(200).send(updateHackathon);
    } catch (error) {
        res.status(500).send(error)
    }
});

const deleteHackathon = catchAsync(async (req, res) => {
    try {
        const deleteHackathon = await deleteHackathons(req, res);
        res.status(200).send(deleteHackathon);
    } catch (error) {
        res.status(500).send(error)
    }
});

const addParticipate = catchAsync(async (req, res) => {
    try {
        const addParticipate = await addParticipates(req, res);
        res.status(200).send(addParticipate);
    } catch (error) {
        res.send(error)
    }
});

const searchHackathon = catchAsync(async (req, res) => {
    try {
        const searchHackathon = await searchHackathons(req, res);
        res.status(200).send(searchHackathon);
    } catch (error) {
        res.send(error);
    }
});
const getParticipate = catchAsync(async (req, res) => {
    try {
        const getParticipate = await getParticipates(req, res);
        res.status(200).send(getParticipate);
    } catch (error) {
        console.log(error);
    }
});
const getAllParticipate = catchAsync(async (req, res) => {
    try {
        const getAllParticipate = await getAllParticipates(req, res);
        res.status(200).send(getAllParticipate);
    } catch (error) {
        res.send(error);
    }
});

const getHackathonActiveStatus = async (req, res, next) => {
    const result = await getHackathonActiveService(req, res)
    res.status(StatusCodes.OK).send(
        {
            success: true,
            message: result && result.length ? ' Active Hackathon with Status' : 'Hackathon not found',
            data: result
        })

    next()
}
const getHackathonPastStatus = async (req, res, next) => {
    const result = await getHackathonPastService(req, res)
    res.status(StatusCodes.OK).send(
        {
            success: true,
            message: result && result.length ? 'Past Hackathon with Status' : 'Hackathon not found',
            data: result
        })

    next()
}
const getHackathonUpcomingStatus = async (req, res, next) => {
    const result = await getHackathonUpcomingService(req, res)
    res.status(StatusCodes.OK).send(
        {
            success: true,
            message: result && result.length ? 'Upcoming Hackathon with Status' : 'Hackathon not found',
            data: result
        })

    next()
}
const getParticipateBasedOnFilter = async (req, res, next) => {
    const result = await getParticipateBasedOnFilterService(req, res)
    res.status(StatusCodes.OK).send(
        {
            success: true,
            message: result && result.length ? ' Participants Found' : 'Participants not Found',
            data: result
        })

    next()
}

module.exports = {
    getAllHackathon,
    addHackathon,
    deleteHackathon,
    updateHackathon,
    addParticipate,
    searchHackathon,
    getParticipate,
    getAllParticipate,
    getHackathonActiveStatus,
    getHackathonPastStatus,
    getHackathonUpcomingStatus,
    getParticipateBasedOnFilter
};
