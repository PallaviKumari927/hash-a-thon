const Hackathon = require('../models/hackathon');



const getAllHackathon = async (req, res) => {
    
        return await Hackathon.find({});

    };

    const   addHackathon = async (req, res) => {

        return await Hackathon.create(req.body);
    };

    const   updateHackathon = async (req, res) => {

        return await Hackathon.findOneAndUpdate({ _id: req.params.id }, req.body);

    };

    const   deleteHackathon = async (req, res) => {
        return await Hackathon.findOneAndRemove({ _id: req.params.id });
    };


module.exports = { getAllHackathon,addHackathon,deleteHackathon,updateHackathon };