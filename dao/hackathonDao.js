const Hackathon = require('../models/hackathon');
const Company = require('../models/company')
const Employee = require('../models/employee')


const getAllHackathon = async (req, res) => {

    return await Hackathon.find({});

};

const addHackathon = async (req, res) => {

    const companyId = req.user._id;
    const { name,
        start_date,
        end_date,
        technology_stack,
        min_requirements,
        max_participants,
        registration_start_date,
        registration_end_date } = req.body;

    const company = await Company.findOne({ _id: req.user._id }).select('role');
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
        
    });

};

const updateHackathon = async (req, res) => {

    return await Hackathon.findOneAndUpdate({ _id: req.params.id }, req.body);

};

const deleteHackathon = async (req, res) => {
    return await Hackathon.findOneAndRemove({ _id: req.params.id });
};

const addParticipate = async (req, res) => {

    if (req.user.role == 'company') {
        return res.status(403).json({ message: 'Only Employees can participate in hackathons.' });
    }
    const employeeId = req.user.employee_id;

    const employee = await Employee.findById(employeeId);
    if (!employee) {
        return res.status(404).json({ message: 'Employee not found.' });
    }

    const hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) {
        return res.status(404).json({ message: 'Hackathon not found.' });
    }


    const currentDate = new Date();
    if (currentDate > hackathon.end_date) {
        return res.status(400).json({ message: 'The hackathon date has already passed.' });
    }

    if (hackathon.participants.length >= hackathon.max_participants) {
        return res.status(400).json({ message: 'The hackathon slot is already full.' });
    }
    if (hackathon.participants.includes(employeeId)) {
        return res.status(400).json({ message: 'Employee is already participating in the hackathon.' });
    }

    for (const registeredHackathonId of employee.registeredHackathons) {
        const registeredHackathon = await Hackathon.findById(registeredHackathonId);

        if (
            hasTimeOverlap(
                hackathon.start_date,
                hackathon.end_date,
                registeredHackathon.start_date,
                registeredHackathon.end_date
            )
        ) {
            return res.status(400).json({
                message: 'Employee is already registered for another hackathon during the same time period.',
            });
        }
    }

    hackathon.participants.push(req.user.employee_id);
    await hackathon.save();

    employee.registeredHackathons.push(hackathon._id);
    await employee.save();

    res.status(200).json({ message: 'Employee successfully registered for the hackathon.' });
};
const hasTimeOverlap = (startDateA, endDateA, startDateB, endDateB) => {
    return startDateA < endDateB && startDateB < endDateA;
};
const searchHackathon = async (req,res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search } = req.query;
    const currentDate = new Date();

    const query = {
      $or: [
        { name: { $regex: new RegExp(search, 'i') } }, // Case-insensitive search by hackathon name
        { technology_stack: { $regex: new RegExp(search, 'i') } }, // Case-insensitive search by technology stack
      ],
    };

    // Add a check for company name search
    if (!isNaN(search)) {
      query.$or.push({ company: search }); // If the search term is a valid ObjectId, search by company ObjectId
    } else {
      query.$or.push({ 'company.name': { $regex: new RegExp(search, 'i') } }); // Case-insensitive search by company name
    }

    const hackathons = await Hackathon.find(query)
      .skip(skip)
      .limit(limit)
      .populate('company', 'name')
      .lean();

    // Calculate the status field dynamically for each hackathon in the response
    const hackathonsWithStatus = hackathons.map((hackathon) => {
      const isRegistrationOpen =
        currentDate >= hackathon.registration_start_date && currentDate <= hackathon.registration_end_date;
      const isSlotsFull = hackathon.participants.length >= hackathon.max_participants;

      let status;
      if (currentDate < hackathon.startDate) {
        status = 'upcoming';
      } else if (currentDate > hackathon.endDate) {
        status = 'past';
      } else {
        status = isRegistrationOpen && !isSlotsFull ? 'open' : 'closed';
      }

      return {
        ...hackathon,
        status,
      };
    });

    const totalHackathons = await Hackathon.countDocuments(query);

    res.json({ total: totalHackathons, page, limit, data: hackathonsWithStatus });

};
const getParticipate = async(req,res) => {

    const companyId = req.user._id;
    const hackathonId = req.params.id;
    // Check if the logged-in company has permission to view participants for this hackathon
    const hackathon = await Hackathon.findOne({ _id: hackathonId, company: companyId }).populate('participants', 'name email');
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found or not created by your company.' });
    }

    const participants = hackathon.participants;
    res.json({ totalParticipants: participants.length, participants });

};
const getAllParticipate = async(req,res) => {
    console.log(req.user._id)
    const companyId = req.user._id;
    const hackathons = await Hackathon.find({ company: companyId }).populate('participants', 'name email');

    res.json(hackathons);
};

module.exports = { getAllHackathon, addHackathon, deleteHackathon, updateHackathon, addParticipate,searchHackathon,getParticipate,getAllParticipate };