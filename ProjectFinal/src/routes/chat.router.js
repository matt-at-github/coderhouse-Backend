const express = require('express');
const router = express.Router();

const ChatModel = require('../models/chat.model.js');

router.get("/", async (req, res) => {

  const chat = ChatModel.find({ id: req.params.email });
  res.status(200).render('chat', { messages: chat.messages });
});

module.exports = router;