const bcrypt = require('bcrypt');

function createHash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

function isOldPassword(newPassword, user) {
  return bcrypt.compareSync(newPassword, user.password);
}

function isValidPassword(password, user) {
  return bcrypt.compareSync(password, user.password);
}

module.exports = {
  createHash,
  isValidPassword,
  isOldPassword
};