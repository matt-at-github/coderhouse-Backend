const mongoose = require('mongoose');

const collectionProducts = 'products';

const schemaProdcuts = new mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  price: Number,
  thumbnails: [String],
  code: String,
  stock: Number,
  status: Boolean

});

const modelProduct = mongoose.model(collectionProducts, schemaProdcuts);

module.exports = modelProduct;