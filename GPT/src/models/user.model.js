// src/models/user.model.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Basic information required for account creation
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  personalId: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  // Good client rate (as client metrics)
  goodClientRate: {
    type: Number,
    default: 0,
  },
  // Contracts count (as client metrics)
  contractsCount: {
    type: Number,
    default: 0,
  },
  // Professional reference properties
  professionalName: {
    type: String,
  },
  professionalPicture: {
    type: String,
  },
  professionalContact: {
    type: String,
  },
  // Good professional rate (as professional metric)
  goodProfessionalRate: {
    type: Number,
    default: 0,
  },
  // Comment count (as professional metric)
  commentCount: {
    type: Number,
    default: 0,
  },
  // Completed jobs (as professional metric)
  completedJobs: {
    type: Number,
    default: 0,
  },
  // List of all jobs done (as professional metric)
  jobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
    },
  ],

});

const User = mongoose.model('User', userSchema);

module.exports = User;
