const ChatService = require('../services/chat.service.js');

class ChatController {

  async getAllMessages(req) {

    try {
      const filter = req.query.filter ? JSON.parse(req.query.filter) : undefined;
      const sort = req.query.sort ? JSON.parse(req.query.sort) : undefined;
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;

      const result = await ChatService.getMessages(filter, limit, page, sort);
      if (!result.success) {
        return { code: 400, message: result.message, success: false };
      }
      return { code: 200, data: result, success: true };
    } catch (error) {
      return { code: 500, message: error.message || 'Internal Server Error', success: false };
    }
  }

  async getChat(req) {
    try {
      const result = await ChatService.find({ user: req.params.email });
      return { code: 200, data: result, success: true };
    }
    catch (error) {
      return { code: 500, message: error.message || 'Internal Server Error', success: false };
    }
  }

  async createMessage(req) {
    try {

      const result = await (new ChatService({ user: req.params.email, message: req.body.message })).save();
      if (!result) {
        return { code: 400, message: result.message, success: false };
      }
      return { code: 200, data: result, success: true };
    }
    catch (error) {
      return { code: 500, message: error.message || 'Internal Server Error', success: false };
    }
  }
}

module.exports = ChatController;