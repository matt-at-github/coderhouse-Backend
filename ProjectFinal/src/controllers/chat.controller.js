const ChatModel = require('../models/chat.model.js');

class ChatController {

  async getAllMessages(req, res) {

    try {
      const filter = req.query.filter ? JSON.parse(req.query.filter) : undefined;
      const sort = req.query.sort ? JSON.parse(req.query.sort) : undefined;
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;

      const result = await getMessages(filter, limit, page, sort);
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }
      // return res.status(200).json({ data: result });
      return res.status(200).render('chat', { data: result });
    } catch (error) {
      return res.status(500).json({ message: `Chat controller error -> ${error.message}` });
    }
  }

  async getChat(req, res) {
    try {
      // TODO: get chat for logged user.
      const result = await ChatModel.find({ user: req.params.email });
      return res.status(200).json({ data: result });
    }
    catch (error) {
      return res.status(500).json({ message: `Chat controller error -> ${error.message}` });
    }
  }

  async createMessage(req, res) {
    try {

      const result = await (new ChatModel({ user: req.params.email, message: req.body.message })).save();
      if (!result) {
        return res.status(400).json({ message: result.message });
      }
      return res.status(200).json({ data: result });
    }
    catch (error) {
      return res.status(500).json({ message: `Chat controller error -> ${error.message}` });
    }
  }
}

module.exports = ChatController;

//Auxiliary methods
async function getMessages(queryFilter = {}, queryLimit = 10, queryPage = 1, querySort = { id: 1 }) {
  try {
    const { docs, totalDocs, limit, page, totalPages, hasNextPage, nextPage, hasPrevPage, prevPage, pagingCounter } = await ChatModel.paginate(queryFilter, { limit: queryLimit, page: queryPage, sort: querySort });

    const messages = docs.map(m => {
      return m.toObject();
    });

    return {
      success: messages.length > 0,
      totalDocs,
      page,
      totalPages,
      limit,
      hasNextPage,
      nextPage,
      hasPrevPage,
      prevPage,
      pagingCounter,
      payload: messages
    };

  } catch (error) {
    return console.error(`Product Service error -> ${error}`);
  }
}