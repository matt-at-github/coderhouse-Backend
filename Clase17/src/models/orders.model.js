const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const schemaOrder = mongoose.Schema({
  nombre: { type: String },
  tam: { type: String },
  precio: { type: Number },
  cantidad: { type: Number }
})

schemaOrder.plugin(mongoosePaginate);
const modelOrder = mongoose.model('orders', schemaOrder);

module.exports = modelOrder;