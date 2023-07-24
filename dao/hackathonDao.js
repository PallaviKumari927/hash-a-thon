const { StatusCodes } = require('http-status-codes')
const Hackathon = require('../models/hackathon');
const Organizer = require('../models/organizer')
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
    .populate('organizer', 'company_name')


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

  res.status(StatusCodes.OK).send(
    {
      success: true,
      message: hackathonsWithStatus && hackathonsWithStatus.length ? 'Data Found' : 'Hackathon not found',
      data: [{ total: totalHackathons, page, limit, data: hackathonsWithStatus }]
    })

};

const addHackathon = async (req, res) => {

  const organizerId = req.user._id;
  const {
    name,
    start_date,
    end_date,
    technology_stack,
    min_requirements,
    max_participants,
    registration_start_date,
    registration_end_date,
    requiredSkills,
    minimumExperienceYears
  } = req.body;

  const organizer = await Organizer.findOne({ _id: req.user._id }).select('role');

  return hackathon = await Hackathon.create({
    name,
    start_date,
    end_date,
    technology_stack,
    min_requirements,
    max_participants,
    registration_start_date,
    registration_end_date,
    requiredSkills,
    minimumExperienceYears,
    organizer: organizerId,

  });

};

const updateHackathon = async (req, res) => {

  const companyId = req.user.id;
  const hackathonId = req.params._id;

  const hackathon = await Hackathon.findOne({ _id: hackathonId, company: companyId });

  if (!hackathon) {
    return res.status(404).json({ message: 'Hackathon not found or not hosted by your company.' });
  }

  if (new Date() >= hackathon.registration_start_date) {
    return res.status(403).json({ message: 'Cannot modify the Hackathon as the registration has started.' });
  }


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

  
  const hackathon = await Hackathon.findOne({ _id: hackathonId, company: companyId });
  console.log(hackathon)
  if (!hackathon) {
    return res.status(404).json({ message: 'Hackathon not found or not hosted by your company.' });
  }


  const employeesToUpdate = await Employee.find({ registeredHackathons: hackathonId });
  console.log(employeesToUpdate)
  for (const employee of employeesToUpdate) {
    employee.registeredHackathons = employee.registeredHackathons.filter(
      (id) => id.toString() !== hackathonId.toString()
    );
    await employee.save();
  }
 
  await hackathon.remove();

  res.json({ message: 'Hackathon canceled successfully.' });

};

const addParticipate = async (req, res) => {

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

  const { experience, skill } = hackathon.min_requirements;

  if (experience && employee.experience < experience) {
    return res.status(400).json({ message: 'You do not satisfy the minimum experience requirement' });
  }

  if (skill && skill.length > 0) {
    const userSkills = employee.skill;
    const missingSkills = skill.filter((requiredSkill) => !userSkills.includes(requiredSkill));
    if (missingSkills.length > 0) {
      return res.status(400).json({ message: `You are missing the following skills: ${missingSkills.join(', ')}` });
    }
  }

  hackathon.participants.push(req.user.employee_id);
  await hackathon.save();

  employee.registeredHackathons.push(hackathon._id);
  await employee.save();

  res.status(200).json({ message: 'Employee successfully registered for the hackathon.' });
};

const searchHackathon = async (req, res) => {
  
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const query = req.query.q ? req.query.q.toString().trim() : ''; 

  const currentTime = new Date();


  const searchQuery = {
    $or: [
      { name: { $regex: query.name, $options: 'i' } }, 
      { technology_stack: { $regex: query, $options: 'i' } },
      { organizer: { $regex: query, $options: 'i' } }, 
    ],
    start_date: { $gte: currentTime }, 
  };
  
  const searchResults = await Hackathon.find(searchQuery)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ start_date: 1 });


};
const getParticipate = async (req, res) => {

  const organizerId = req.user._id;
  const hackathonId = req.params.id;

  const hackathon = await Hackathon.findOne({ _id: hackathonId, organizer: organizerId }).populate('participants', 'name email');
  if (!hackathon) {
    return res.status(404).json({ message: 'Hackathon not found or not created by you.' });
  }

  const participants = hackathon.participants;
  res.json({ totalParticipants: participants.length, participants });

};
const getAllParticipate = async (req, res) => {

  const organizerId = req.user._id;
  const hackathons = await Hackathon.find({ organizer: organizerId }).populate('participants', 'name email');

  res.json(hackathons);
};
const getHackathonActiveDao = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const currentTime = new Date();

  return activeHackathons = await Hackathon.find({
    start_date: { $lte: currentTime },
    end_date: { $gte: currentTime },
  })
    .select('-participants')
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ start_date: 1 });


};
const getHackathonPastDao = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const currentTime = new Date().toISOString();

  return pastHackathons = await Hackathon.find({
    endDate: { $lt: currentTime },
  })
    .select('-participants')
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ endDate: -1 });

};
const getHackathonUpcomingDao = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const currentTime = new Date().toISOString();

  return upcomingHackathons = await Hackathon.find({
    start_date: { $gt: currentTime },
  })
    .select('-participants')
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ start_date: 1 });


};
const getParticipateBasedOnFilterDao = async (req,res) => {
  const hackathonId = req.params.hackathonId;
    const { experience, technology_stack } = req.query;

    // Construct the MongoDB query to filter participants based on the provided parameters
    const filterQuery = {
      hackathon: hackathonId,
    };

    if (experience) {
      filterQuery['experience'] = experience;
    }

    if (technology_stack) {
      filterQuery['technology_stack'] = technology_stack;
    }

    const participants = await Hackathon.find(filterQuery).populate('participants');
    console.log(participants)
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
  getHackathonActiveDao,
  getHackathonPastDao,
  getHackathonUpcomingDao,
  getParticipateBasedOnFilterDao
};