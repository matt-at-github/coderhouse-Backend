const mongoose = require('mongoose');

const collectionUsers = 'users';

const UserSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: false
  },
  last_name: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false,
    index: true,
    unique: true
  },
  age: {
    type: Number,
    required: false
  },
  password: {
    type: String,
    required: false
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products'
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin'],
  },
});

const UserModel = mongoose.model(collectionUsers, UserSchema);

module.exports = UserModel;