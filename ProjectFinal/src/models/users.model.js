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
  cartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'carts'
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin', 'premium'],
  },
  documents: [{
    name: String,
    reference: String,
    documentType: String,
  }],
  last_connection: {
    type: Date,
    default: Date.now
  }
});

const UserModel = mongoose.model(collectionUsers, UserSchema);

module.exports = UserModel;