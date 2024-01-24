const PORT = 8080;
const STATIC = "";

const express = require('express');
const app = express();
const handlebarsInstance = require('express-handlebars');

// Middelware
app.use(express.json());
// app.use(express.urlencoded({ extended:true }));

// Routes 
const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const views = require('./routes/views.router');
const realtimeProducts = require('./routes/realtimeProducts.router');

app.use(STATIC, express.static(`${__dirname}/public`));
app.use('/favicon.ico', express.static(`${__dirname}/public/img/favicon.png`));

// Handlebars
app.engine('handlebars', handlebarsInstance.engine());
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/public/views`); // Por qué ./public/views no funciona?

app.use('/', views);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use('/realtimeProducts', realtimeProducts);

// Multer
//
//

// Mongoose connection
const mongooseConnection = require('./db/products.connection.js');
mongooseConnection.connect;

// Server init
const httpServer = app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}${STATIC}`));

// Socket.io
const socketIOManager = require('./controllers/SocketIO');
const socket = new socketIOManager(httpServer);

const ProductManager = require('./controllers/ProductManager.js');
const productsDBPath = ('./src/db/products.json');
const productManager = new ProductManager(productsDBPath);

socket.init(productManager);