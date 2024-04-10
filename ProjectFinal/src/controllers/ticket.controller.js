const TicketModel = require('../models/ticket.model.js');
const ticketModel = new TicketModel();

class TicketController {

  async createTicket(purchase_datetime, amount, buyer) {
    try {
      console.log('ticket.controller', 'createTicket', { purchase_datetime, amount, buyer });
      const code = await getTicketCode();
      const newTicket = await ticketModel.save({ code, purchase_datetime, amount, buyer });
      console.log('ticket.controller', 'createTicket', 'newTicket', newTicket);
      return newTicket;
    } catch (error) {
      return `User controller error -> ${error}.`;
    }
  }
}

async function getTicketCode() {
  return await ticketModel.findOne().sort({ _id: -1 }).limit(1);
}

module.exports = TicketController;