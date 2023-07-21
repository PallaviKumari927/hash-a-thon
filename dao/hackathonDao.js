const Hackathon = require('../models/hackathon');
const Company = require('../models/company')
const Employee = require('../models/employee')


const hasTimeOverlap = (startDateA, endDateA, startDateB, endDateB) => {
  return startDateA < endDateB && startDateB < endDateA;
};
const getAllHackathon = async (req, res) => {

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 2;
  const skip = (page - 1) * limit;

  const currentDate = new Date();

  const hackathons = await Hackathon.find()
    .skip(skip)
    .limit(limit)
    .populate('company', 'name') // Populate the company field with the name only

  // Calculate the status field dynamically for each hackathon in the response
  const hackathonsWithStatus = hackathons.map((hackathon) => {
    const isRegistrationOpen =
      currentDate >= hackathon.registration_start_date && currentDate <= hackathon.registration_end_date;
    const isSlotsFull = hackathon.participants.length >= hackathon.max_participants;

    let status;
    if (currentDate < hackathon.start_date) {
      status = 'upcoming';
    } else if (currentDate > hackathon.end_date) {
      status = 'past';
    } else {
      status = isRegistrationOpen && !isSlotsFull ? 'open' : 'closed';
    }

    return {
      ...hackathon._doc,
      status,
    };
  });

  const totalHackathons = await Hackathon.countDocuments();

  res.json({ total: totalHackathons, page, limit, data: hackathonsWithStatus });


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

  const companyId = req.user.id;
  const hackathonId = req.params._id;

  // Find the Hackathon by the provided hackathonId and company
  const hackathon = await Hackathon.findOne({ _id: hackathonId, company: companyId });

  if (!hackathon) {
    return res.status(404).json({ message: 'Hackathon not found or not hosted by your company.' });
  }

  // Check if the registration has not started yet
  if (new Date() >= hackathon.registration_start_date) {
    return res.status(403).json({ message: 'Cannot modify the Hackathon as the registration has started.' });
  }

  // Update the Hackathon information
  hackathon.name = req.body.name;
  hackathon.start_date = req.body.start_date;
  hackathon.end_date = req.body.end_date;
  hackathon.technology_stack = req.body.technology_stack;
  hackathon.min_requirements = req.body.min_requirements;
  hackathon.max_participants = req.body.max_participants;
  hackathon.registration_start_date = req.body.registration_start_date;
  hackathon.registration_end_date = req.body.registration_end_date;

  await hackathon.save();

  res.json({ message: 'Hackathon information updated successfully.' });


};

const deleteHackathon = async (req, res) => {
  const companyId = req.user._id;
  const hackathonId = req.params.id;
  console.log(companyId);
  console.log(hackathonId)

  // Find the Hackathon by the provided hackathonId and company
  const hackathon = await Hackathon.findOne({ _id: hackathonId, company: companyId });
  console.log(hackathon)
  if (!hackathon) {
    return res.status(404).json({ message: 'Hackathon not found or not hosted by your company.' });
  }

  // Check if the registration has not started yet

  // Remove the Hackathon from employees' registeredHackathons
  const employeesToUpdate = await Employee.find({ registeredHackathons: hackathonId });
  console.log(employeesToUpdate)
  for (const employee of employeesToUpdate) {
    employee.registeredHackathons = employee.registeredHackathons.filter(
      (id) => id.toString() !== hackathonId.toString()
    );
    await employee.save();
  }
  // Delete the Hackathon
  await hackathon.remove();

  res.json({ message: 'Hackathon canceled successfully.' });

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
  
    const companyId = req.user._id;
    const hackathons = await Hackathon.find({ company: companyId }).populate('participants', 'name email');

    res.json(hackathons);
};

module.exports = { getAllHackathon, addHackathon, deleteHackathon, updateHackathon, addParticipate,searchHackathon,getParticipate,getAllParticipate };