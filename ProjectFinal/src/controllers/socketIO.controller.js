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

      console.log('Socket Client Connected');

      await socket.on('pullMessages', async (data) => {
        console.log('Socket Client', 'pullMessages');
        const messages = await ChatModel.find({ user: data.user });
        socket.emit('reply', messages);
      });

      await socket.on('message', async (data) => {
        console.log('Socket Client', 'new message');
        const newMessage = new ChatModel({ user: data.user, message: data.message });
        await newMessage.save();
        this.io.sockets.emit('message', data);

        const messages = await ChatModel.find({ user: data.user });
        socket.emit('reply', messages);
      });

      await socket.on('regiterNewProduct', async (data) => {
        console.log('Socket Client', 'regiterNewProduct', data);
        if (data) {
          const { title, description, price, thumbnails, code, stock, status } = data;
          const newProduct = await productController.createRealtimeProduct({ title, description, price, thumbnails, code, stock, status });
          console.log('Socket Client', 'regiterNewProduct', 'newProduct', newProduct);
          if (newProduct.success) {
            this.io.sockets.emit('regiterNewProductResponse', { success: newProduct.success, title: 'Successful creation', text: 'New product created!.', product: newProduct.message });
            this.io.sockets.emit('connectionResponse', await productController.getRealTimeProducts());
          } else {
            this.io.sockets.emit('regiterNewProductResponse', { success: newProduct.success, title: 'Failed creation', text: newProduct.message });
          }
        }
      });

      this.io.sockets.emit('connectionResponse', await productController.getRealTimeProducts());

      await socket.on('deleteProduct', async (data) => {
        console.log('Socket Client', 'deleteProduct');
        const deleted = await productController.deleteRealtimeProduct(data);
        this.io.sockets.emit('productDeleted', { success: deleted.success, title: 'Deleded', message: deleted.message, products: await productController.getRealTimeProducts() });
      });
    });
  }
}

module.exports = SocketIOManager;