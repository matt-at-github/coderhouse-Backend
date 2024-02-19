const PORT = 8080;
const SECRET_KEY = "*KeySuperSecreta!";

const express = require('express');
const app = express();
const handlebarsInstance = require('express-handlebars');

const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");

const database = require('./connectionSettings.json');

const mongoStorage = MongoStore.create({
  mongoUrl: database.database_connection_url,
  ttl: 60 * 10,
});

// Mongo connection
require('./db/db.connection.js');

// Middelware
app.use(express.json());
app.use(cookieParser(SECRET_KEY));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: SECRET_KEY,
  resave: true,
  saveUninitialized: true,
  store: mongoStorage,
  // cookie: { httpOnly: false }
}));

app.use(auth); // My custom authentication middleware.

// Routes 
const productsRouter = require("./routes/products.router");
const productsAPIRouter = require("./routes/API/api.products.router.js");
const cartsAPIRouter = require("./routes/API/api.carts.router.js");
const chatRouter = require("./routes/chat.router.js");
const chatAPIRouter = require("./routes/API/api.chat.router.js");
const usersRouter = require('./routes/users.router.js');
const usersAPIRouter = require('./routes/API/api.users.router.js');
const sessionAPIRouter = require('./routes/API/api.sessions.router.js');

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
app.use('/api/users', usersAPIRouter);
app.use('/api/session', sessionAPIRouter);

// Routes
app.use("/products", productsRouter);
app.use('/chat', chatRouter);

app.use('/users', usersRouter);

// app.get('/', (req, res) => { return res.redirect('/products'); });
app.use("/", productsRouter);

// Multer
//
//

// Server init
const httpServer = app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

// Socket.io
const socketIOManager = require('./controllers/messages.controller.js');
const socket = new socketIOManager(httpServer);
socket.init();

// Authentication middleware
function auth(req, res, next) {

  // console.log('Middleware auth:', req.session);
  if (req.session.login) {
    return next();
  }
  // return res.status(401).send('Unauthorized');
  return next();
}
