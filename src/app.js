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

app.use(STATIC, express.static(`${__dirname}/public`));
app.use('/favicon.ico', express.static(`${__dirname}/public/img/favicon.png`));

// Handlebars
app.engine('handlebars', handlebarsInstance.engine());
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/public/views`); // Por qué ./public/views no funciona?

app.use('/', views);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Multer
//
//

// Server init
const httpServer = app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}${STATIC}`));

// Socket.io
const socket = require('socket.io');
const io = socket(httpServer);
io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('message', (data) => {
    console.log(data);
    io.sockets.emit('message', data);
  });

  socket.emit('greet', 'Welcome to OnlyShop');
});
