const mongoose = require("mongoose");

const hackathon = new mongoose.Schema({
    hackathon_id: {
      type: Number,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: String,
      allowNull: false,
    },
    start_date: {
      type: Date,
      allowNull: false,
    },
    end_date: {
      type: Date,
      allowNull: false,
    },
    technology_stack: {
      type: String,
      allowNull: false,
    },
    min_requirements: {
      type: Number,
      allowNull: false,
    },
    max_participants: {
      type: Number,
      allowNull: false,
    },
    registration_start_date: {
      type: Date,
      allowNull: false,
    },
    registration_end_date: {
      type: Date,
      allowNull: false,
    },
    status: {
      type: String,
      allowNull: false,
      defaultValue: 'upcoming', 
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
      },
  });
  
  module.exports = mongoose.model('Hackathon',hackathon);
  