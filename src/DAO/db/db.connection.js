const password = 'Cn9o0TqM4pQak0kx';
const databaseName = 'OnlyShop';
const uri = `mongodb+srv://matiasnicolasmoresi:${password}@cluster0.5jasxmm.mongodb.net/${databaseName}?retryWrites=true&w=majority`;

const mongoose = require('mongoose');

async function connect() {
  return await mongoose.connect(uri)
    .then(() => console.log('Conexión exitosa a MongoDB'))
    .catch((error) => console.error(`Error: ${error}`));
}

module.exports = connect();