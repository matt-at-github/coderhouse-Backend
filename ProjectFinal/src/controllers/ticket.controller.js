const TicketModel = require('../models/ticket.model.js');

class TicketController {

  async createTicket(purchase_datetime, amount, buyer) {
    try {
      const code = await getTicketCode() + 1;
      const newTicket = await TicketModel.create({ code, purchase_datetime, amount, buyer });
      console.log('ticket.controller', 'createTicket', 'newTicket', newTicket);
      return newTicket;
    } catch (error) {
      return `Ticket controller error -> ${error}.`;
    }
  }
}

async function getTicketCode() {
  const code = (await TicketModel.findOne().sort({ code: -1 }).limit(1).exec())?.code;
  return Number.parseInt(code ?? 0);
}

module.exports = TicketController;