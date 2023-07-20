const { getAllHackathons,addHackathons,deleteHackathons,updateHackathons } = require('../services/hackathonService')


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
        res.status(500).send(error)
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

module.exports = {getAllHackathon,addHackathon,deleteHackathon,updateHackathon};
