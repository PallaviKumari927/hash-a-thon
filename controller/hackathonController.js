const { getAllHackathons,addHackathons,deleteHackathons,updateHackathons,addParticipates,searchHackathons,getParticipates,getAllParticipates } = require('../services/hackathonService')


const getAllHackathon = async(req,res) => {
    try{
    const data = await getAllHackathons(req,res);
    res.status(200).send(data);
    }catch(error){
        console.log(error);
        res.status(500).send(error)
    }
};

const addHackathon = async(req,res) => {
    try{
    const addHackathon = await addHackathons(req,res);
    res.status(201).send(addHackathon);
    }catch(error){
        res.send(error)
    }
};

const updateHackathon = async(req,res) => {
    try{
    const updateHackathon = await updateHackathons(req,res);
    res.status(200).send(updateHackathon);
    }catch(error){
        res.status(500).send(error)
    }
};

const deleteHackathon = async(req,res) => {
    try{
    const deleteHackathon = await deleteHackathons(req,res);
    res.status(200).send(deleteHackathon);
    }catch(error){
        res.status(500).send(error)
    }
};

const addParticipate = async(req,res) => {
    try{
        const addParticipate = await addParticipates(req,res);
        res.status(200).send(addParticipate);
    }catch(error){
        res.send(error)
    }
};

const searchHackathon = async(req,res) => {
    try{
        const searchHackathon = await searchHackathons(req,res);
        res.status(200).send(searchHackathon);
    }catch(error){
        res.send(error);
    }
};
const getParticipate = async(req,res) => {
    try{
        const getParticipate = await getParticipates(req,res);
        res.status(200).send(getParticipate);
    }catch(error){
        console.log(error);
    }
};
const getAllParticipate = async(req,res) => {
    try{
        const getAllParticipate = await getAllParticipates(req,res);
        res.status(200).send(getAllParticipate);
    }catch(error){
        res.send(error);
    }
}

module.exports = {getAllHackathon,addHackathon,deleteHackathon,updateHackathon,addParticipate,searchHackathon,getParticipate,getAllParticipate};
