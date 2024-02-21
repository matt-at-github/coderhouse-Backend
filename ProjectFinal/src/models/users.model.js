const mongoose = require("mongoose");

const collectionUsers = 'users';

const UserSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin'],
  }
});

const UserModel = mongoose.model(collectionUsers, UserSchema);

module.exports = UserModel;