const mongoose = require('mongoose');

const collectionChat = 'messages';

const schemaChat = new mongoose.Schema({
  user: { type: String },
  message: { type: String }
});

const modelChat = mongoose.model(collectionChat, schemaChat);
module.exports = modelChat;