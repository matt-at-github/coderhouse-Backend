const mongoose = require('mongoose');

const collectionCarts = 'carts';

const schemaCarts = new mongoose.Schema({
  id: {
    type: Number,
    default: 0,
    unique: true
  },
  productos: [
    {
      producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true
      },
      cantidad: {
        type: Number,
        required: true
      }
    }
  ]
  ,
});

const modelCarts = mongoose.model(collectionCarts, schemaCarts);
module.exports = modelCarts;