const express = require('express');
const router = express.Router();

const ChatController = require('../../controllers/chat.controller.js');
const authenticateRole = require('../../middleware/checkrole.js');
const chatController = new ChatController();

// Get all messages 
router.get('/', authenticateRole(['user']), chatController.getAllMessages);

// Get Messages for a User
router.get('/:email', authenticateRole(['user']), chatController.getChat);

// Creates new message for User
router.post('/:email', authenticateRole(['user']), chatController.createMessage);

module.exports = router;