const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mongoosePaginate = require('mongoose-paginate-v2');

const collectionProducts = 'products';

const schemaProducts = Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Schema.Types.Decimal128, required: true },
  thumbnails: [String],
  code: { type: String, required: true, unique: true },
  stock: { type: Number, required: true },
  category: { type: String },
  status: { type: Boolean, def: true }
});

schemaProducts.plugin(mongoosePaginate);
const modelProduct = mongoose.model(collectionProducts, schemaProducts);

module.exports = modelProduct;
