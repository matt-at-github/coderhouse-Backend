const socket = require('socket.io');

class SocketIOManager {

  io;

  constructor(httpServer) {
    this.io = socket(httpServer);
  }

  init(productManager) {

    this.io.on('connection', async (socket) => {

      console.log('Client connected');

      socket.on('regiterNewProduct', async (data) => {
        console.log('regiterNewProduct', data);
        if (data) {
          const { title, description, price, thumbnails, code, stock, status } = data;
          const newProduct = await productManager.addProduct(title, description, price, thumbnails, code, stock, status);
          console.log('newProduct', newProduct);
          if (newProduct.success) {
            this.io.sockets.emit('regiterNewProductResponse', { success: newProduct.success, title: "Successful creation", text: "New product created!.", product: newProduct.message });
          } else {
            this.io.sockets.emit('regiterNewProductResponse', { success: newProduct.success, title: "Failed creation", text: newProduct.message });
          }
        }
      });

      this.io.sockets.emit('connectionResponse', await productManager.getProducts());
    });
  }
}

module.exports = SocketIOManager;