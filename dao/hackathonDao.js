const Hackathon = require('../models/hackathon');
const Company = require('../models/company')


const getAllHackathon = async (req, res) => {
    
        return await Hackathon.find({});

    };

    const addHackathon = async (req, res) => {

        const companyId = req.user._id;
        const {name,
            start_date,
            end_date,
            technology_stack,
            min_requirements,
            max_participants,
            registration_start_date,
            registration_end_date,status} = req.body;

        const company = await Company.findOne({_id:req.user._id}).select('role');
        if (req.user.role == 'employee') {
            return res.status(403).json({ message: 'Only Companies can create hackathons.' });
          }

          return hackathon = await Hackathon.create({
            name,
            start_date,
            end_date,
            technology_stack,
            min_requirements,
            max_participants,
            registration_start_date,
            registration_end_date,
            company: companyId,
            status
          });
          
    };

    const   updateHackathon = async (req, res) => {

        return await Hackathon.findOneAndUpdate({ _id: req.params.id }, req.body);

    };

    const   deleteHackathon = async (req, res) => {
        return await Hackathon.findOneAndRemove({ _id: req.params.id });
    };


module.exports = { getAllHackathon,addHackathon,deleteHackathon,updateHackathon };