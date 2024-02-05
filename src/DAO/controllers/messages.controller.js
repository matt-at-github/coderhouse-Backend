const socket = require('socket.io');

const ChatModel = require('../models/chat.model.js');

class SocketIOManager {

  io;
  constructor(httpServer) {
    this.io = socket(httpServer);
  }

  init() {

    this.io.on("connection", async (socket) => {
      
      socket.on('pullMessages', async (data) => {
        const messages = await ChatModel.find({ user: data.user });
        socket.emit("reply", messages);
      });

      await socket.on("message", async (data) => {

        const newMessage = new ChatModel({ user: data.user, message: data.message });
        await newMessage.save();
        this.io.sockets.emit("message", data);

        const messages = await ChatModel.find({ user: data.user });
        socket.emit("reply", messages);
      });
    });
  }
}

module.exports = SocketIOManager;