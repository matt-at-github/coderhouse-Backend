const socket = require('socket.io');

const ProductController = require('./product.controller.js');
const productController = new ProductController();

const ChatModel = require('../models/chat.model.js');

class SocketIOManager {

  io;
  constructor(httpServer) {
    this.io = socket(httpServer);
  }

  init() {

    this.io.on('connection', async (socket) => {

      // ==========================================================================================
      // Chat
      await socket.on('pullMessages', async (data) => {
        const messages = await ChatModel.find({ user: data.user });
        socket.emit('reply', messages);
      });

      await socket.on('message', async (data) => {
        const newMessage = new ChatModel({ user: data.user, message: data.message });
        await newMessage.save();
        this.io.sockets.emit('message', data);

        const messages = await ChatModel.find({ user: data.user });
        socket.emit('reply', messages);
      });

      // ==========================================================================================
      // Real time Products      
      this.io.sockets.emit('connectionResponse', await productController.getRealTimeProducts());

      await socket.on('regiterNewProduct', async (data) => {
        if (data) {
          const { title, description, price, thumbnails, code, stock, status, owner } = data;
          const newProduct = await productController.createRealtimeProduct({ title, description, price, thumbnails, code, stock, status, owner });
          if (newProduct.success) {
            this.io.sockets.emit('regiterNewProductResponse', { success: newProduct.success, title: 'Successful creation', text: 'New product created!.', product: newProduct.message });
            this.io.sockets.emit('connectionResponse', await productController.getRealTimeProducts());
          } else {
            this.io.sockets.emit('regiterNewProductResponse', { success: newProduct.success, title: 'Failed creation', text: newProduct.message });
          }
        }
      });

      await socket.on('deleteProduct', async (data) => {
        // req.logger.debug('Socket Client', 'deleteProduct');
        const deleted = await productController.deleteRealtimeProduct(data);
        this.io.sockets.emit('productDeleted', { success: deleted.success, title: 'Deleded', message: deleted.message, products: await productController.getRealTimeProducts() });
      });
    });
  }
}

module.exports = SocketIOManager;