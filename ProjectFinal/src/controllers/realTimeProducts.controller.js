const socketIOManager = require('../FSManagers/SocketIO.js');

class RealTimeProduct {

  socket;

  contructor(httpServer) {
    this.socket = new socketIOManager(httpServer).init();
  }

  renderRealTimeProduct(req, res) {
    try {
      res.status(200).render('realtimeProducts');
    } catch (error) {
      return res.status(500).render('error', { error: 'Real Time Products controller error', message: error.message });
    }
  }
}

module.exports = RealTimeProduct;