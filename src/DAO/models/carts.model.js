const mongoose = require('mongoose');

const collectionCarts = 'carts';

const schemaCarts = new mongoose.Schema({
  id: {
    type: Number,
    default: 0,
    unique: true
  },
  // productos: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'productos'
  // }],
  productos: [
    {
      id: { type: Number },
      cantidad: { type: Number }
    }
  ]
});

const modelCarts = mongoose.model(collectionCarts, schemaCarts);
module.exports = modelCarts;