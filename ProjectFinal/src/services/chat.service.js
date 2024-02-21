const ChatModel = require('../models/chat.model.js');

async function getMessages(queryFilter = {}, queryLimit = 10, queryPage = 1, querySort = { id: 1 }) {

  console.log('chats.service getProducts queryFilter 0'); // TODO: remove

  try {

    console.log('chat.service getMessages queryFilter 1', queryFilter); // TODO: remove
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
    return console.log(`Product Service error -> ${error}`);
  }
}

ChatModel.getMessages = getMessages;
module.exports = ChatModel;