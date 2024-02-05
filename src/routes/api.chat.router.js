const express = require('express');
const router = express.Router();

const ChatModel = require('../DAO/models/chat.model.js');

router.get("/:email", async (req, res) => {

  try {
    const chat = await ChatModel.find({ user: req.params.email });
    return res.send(chat);
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || undefined;
    const products = (await ChatModel.find()).slice(0, limit);
    return res.send(products);
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.post("/:email", async (req, res) => {

  try {

    const newMessage = new ChatModel({ user: req.params.email, message: req.body.message });
    await newMessage.save();
    return res.status(201).send(newMessage);

  } catch (error) {
    res.status(500).send(`Error: ${error}`);
    console.error(`Error: ${error}`);
  }
});

module.exports = router;