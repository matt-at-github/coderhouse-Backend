const jwt = require('jsonwebtoken');

const { jwtConfig } = require('../config/config.js');

const generateToken = (user) => {
  return jwt.sign(user, jwtConfig.secretOrKey, { expiresIn: jwtConfig.jwt.tokenLifeSpan });
};

function generateResetToken() {
  // Generar un número aleatorio entre 100000 y 999999 (ambos incluidos)
  const token = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  return token.toString();
}

module.exports = {
  generateToken,
  generateResetToken
};