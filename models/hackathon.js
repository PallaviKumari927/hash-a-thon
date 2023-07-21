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
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
      },
      participants: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Employee',
        },
      ],
  });

  hackathon.virtual('status').get(function () {
    const currentDate = new Date();
    if (currentDate > this.end_date) {
      return 'past';
    } else if (currentDate < this.start_date) {
      return 'upcoming';
    } else {
      return 'active';
    }
  });
  
  module.exports = mongoose.model('Hackathon',hackathon);
  