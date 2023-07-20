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
  },
  email: {
    type: String,
    allowNull: false,
    unique: true,
  },
  password: {
    type: String,
    allowNull: false,
  },
  designation: {
    type: String,
    allowNull: false,
  },
  role: {
    type: String,
    default: 'employee',
  },
});

module.exports = mongoose.model('Employee',employee);