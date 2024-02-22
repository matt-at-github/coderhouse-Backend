const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mongoosePaginate = require('mongoose-paginate-v2');

const collectionChat = 'messages';

const schemaChat = Schema({
  user: { type: String },
  message: { type: String }
});

schemaChat.plugin(mongoosePaginate);
const modelChat = mongoose.model(collectionChat, schemaChat);
module.exports = modelChat;