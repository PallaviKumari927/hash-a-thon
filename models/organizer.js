const mongoose = require('mongoose');

const organizerSchema = new mongoose.Schema({
  company_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'company', 
  },
});

module.exports = mongoose.model('Organizer', organizerSchema);