const express = require('express');
const router = express.Router();

const ChatModel = require('../../models/chat.model.js');
const ChatController = require('../../controllers/chat.controller.js');
const chatController = new ChatController();

// Get all messages 
router.get("/", async (req, res) => {
  console.log('api.chats.router GET'); // TODO: remove
  try {
    const result = await chatController.getAllMessages(req);
    handleResponse(res, result);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// Get Messages for a User
router.get("/:email", async (req, res) => {
  console.log('api.chats.router GET /:email'); // TODO: remove
  try {
    const result = await chatController.getChat(req);
    handleResponse(res, result);
  } catch (error) {
    return res.status(500).send({ message: error.message || 'Internal Server Error' });
  }
});

router.post("/:email", async (req, res) => {
  console.log('api.chats.router POST /:email'); // TODO: remove
  try {
    const result = await chatController.createMessage(req);
    handleResponse(res, result);
  } catch (error) {
    return res.status(500).send({ message: error.message || 'Internal Server Error' });
  }
});

module.exports = router;

// Auxiliary methods
// Helper function for response.
const handleResponse = (res, result) => {
  if (result.success) {
    res.status(result.code).send(result.data);
  } else {
    res.status(result.code).send({ message: result.message });
  }
};