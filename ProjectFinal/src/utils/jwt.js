const jwt = require("jsonwebtoken");

const appSettings = require('../appSettings.json');

const generateToken = (user) => {
  return jwt.sign(user, appSettings.jwt.private_key, { expiresIn: appSettings.jwt.tokenLifeSpan });
};

module.exports = generateToken;