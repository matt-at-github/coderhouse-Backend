const { mongoConnectionConfig } = require('../config/config.js');
const mongoose = require('mongoose');

class Database {
  static #instance;

  constructor() {
    mongoose.connect(mongoConnectionConfig.url)
      .then(() => console.log('Conexión exitosa a MongoDB'))
      .catch((error) => console.error(`Error: ${error}`));
  }

  static getInstance() {
    console.log('Initiating mongo collection');
    if (!this.#instance) {
      this.#instance = new Database();
    }
    return this.#instance;
  }
}

module.exports = Database.getInstance();