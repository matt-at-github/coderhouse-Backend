const bcrypt = require('bcrypt');

function createHash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

function isValidPassword(password, user) {
  return bcrypt.compareSync(password, user.password);
}

module.exports = {
  createHash,
  isValidPassword
};