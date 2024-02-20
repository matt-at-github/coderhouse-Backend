const mongoose = require('mongoose');

const collectionMessages = 'messages';

const schemaMessages = new mongoose.Schema({
  user: { type: String },
  message: { type: String }
});

const modelMessages = mongoose.model(collectionMessages, schemaMessages);

module.exports = modelMessages;