const mongoose = require('mongoose');

const collectionTickets = 'tickets';

const ticketSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  purchase_datetime: Date,
  amount: Number,
  buyer: String
});

const TicketModel = mongoose.model(collectionTickets, ticketSchema);

module.exports = TicketModel;