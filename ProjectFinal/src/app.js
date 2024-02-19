const PORT = 8080;

const express = require('express');
const app = express();
const handlebarsInstance = require('express-handlebars');

// Middelware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes 
const productsRouter = require("./routes/products.router");
const productsAPIRouter = require("./routes/api.products.router");
const cartsAPIRouter = require("./routes/api.carts.router.js");
const chatRouter = require("./routes/chat.router.js");
const chatAPIRouter = require("./routes/api.chat.router.js");

// const home = require('./routes/home.router.js');

app.use(express.static(`${__dirname}/public`));
app.use('/favicon.ico', express.static(`${__dirname}/public/img/favicon.png`));

// Handlebars
app.engine('handlebars', handlebarsInstance.engine());
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/public/views`); // Por qué ./public/views no funciona?

// API Routes
app.use("/api/products", productsAPIRouter);
app.use("/api/carts", cartsAPIRouter);
app.use('/api/chats', chatAPIRouter);

// Routes
app.get('/', (req, res) => { return res.redirect('/products'); });
app.use("/products", productsRouter);
app.use('/chat', chatRouter);

// Multer
//
//

// Mongoose connection
const mongooseConnection = require('./db/db.connection.js');
mongooseConnection.connect;

// Server init
const httpServer = app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

// Socket.io
const socketIOManager = require('./controllers/messages.controller.js');
const socket = new socketIOManager(httpServer);
socket.init();