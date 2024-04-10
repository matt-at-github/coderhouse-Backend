const mongoose = require('mongoose');

const collectionCarts = 'carts';

const schemaCarts = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ],
});

const modelCarts = mongoose.model(collectionCarts, schemaCarts);
module.exports = modelCarts;