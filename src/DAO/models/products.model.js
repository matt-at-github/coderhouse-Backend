const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionProducts = 'products';

const schemaProducts = Schema({
  id: { type: Number, def: 0, unique: true },
  title: { type: String, required: true },
  description: String,
  price: { type: Schema.Types.Decimal128, required: true },
  thumbnails: [String],
  code: { type: String, required: true, unique: true },
  stock: { type: Number, required: true },
  status: { type: Boolean, def: true }

});

const modelProduct = mongoose.model(collectionProducts, schemaProducts);

module.exports = modelProduct;