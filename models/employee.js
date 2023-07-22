const mongoose = require("mongoose");

const employee = new mongoose.Schema({
  employee_id: {
    type: Number,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: String,
    allowNull: false,
    unique: true,
    required: [true, "Employee name is required"]
  },
  email: {
    type: String,
    allowNull: false,
    unique: true,
    required: [true, "Employee email is required"]
  },
  password: {
    type: String,
    allowNull: false,
    required: [true, "Employee password is required"]
  },
  designation: {
    type: String,
    allowNull: false,
    required: [true, "Employee designation is required"]
  },
  experience: {
    type: Number,
    allowNull: false,
    required: [true, "Employee experience is required"]
  },
  skill: {
    type: [String],
  },
  role: {
    type: String,
    default: 'employee',
    required: [true, "Employee role is required"]
  },
  registeredHackathons: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hackathon',
    },
  ],
});

module.exports = mongoose.model('Employee', employee);