const mongoose = require("mongoose");

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

UserSchema.methods.isAdmin = function () {
  console.log(this.model("user").role);
  return this.model("user").role === 'admin';
};

const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;