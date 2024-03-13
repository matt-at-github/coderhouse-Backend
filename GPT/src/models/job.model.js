// src/models/job.model.js
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  contractorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  professionalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  beforePicture: {
    type: String,
    required: true,
  },
  afterPicture: {
    type: String,
    required: true,
  },
  realizationDate: {
    type: Date,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
  },
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
