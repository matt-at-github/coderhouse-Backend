// const password = 'Cn9o0TqM4pQak0kx';
// const databaseName = 'OnlyShop';
// const uri = `mongodb+srv://matiasnicolasmoresi:${password}@cluster0.5jasxmm.mongodb.net/${databaseName}?retryWrites=true&w=majority`;
const database = require('./../connectionSettings.json');

const mongoose = require('mongoose');

mongoose.connect(database.database_connection_url)
  .then(() => console.log('Conexión exitosa a MongoDB'))
  .catch((error) => console.error(`Error: ${error}`));