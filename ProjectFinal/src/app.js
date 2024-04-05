const { mongoConnectionConfig: mongoConnection, cookieParserConfig: cookie_parser, port } = require('./config/config.js');

const express = require('express');
const app = express();
const handlebarsInstance = require('express-handlebars');

const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const mongoStorage = MongoStore.create({
  mongoUrl: mongoConnection.url,
  ttl: mongoConnection.timeToLive,
});

// Mongo connection
require('./db/db.connection.js');

//Passport: 
const passport = require('passport');
const initializePassport = require('./config/passport.config.js');
initializePassport();

// Middelware
app.use(express.json());
app.use(cookieParser(cookie_parser.secret_key));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: cookie_parser.secret_key,
  resave: true,
  saveUninitialized: true,
  store: mongoStorage
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(authorization); // My custom authentication middleware.

// Routes 
const productsRouter = require('./routes/products.router');
// const productsAPIRouter = require('./routes/API/api.products.router.js');
const cartsRouter = require('./routes/carts.router.js');
// const cartsAPIRouter = require('./routes/API/api.carts.router.js');
// const chatRouter = require('./routes/chat.router.js');
const chatAPIRouter = require('./routes/API/api.chat.router.js');
const usersRouter = require('./routes/users.router.js');
const usersAPIRouter = require('./routes/API/api.users.router.js');
const sessionRouter = require('./routes/sessions.router.js');
const viewsRouter = require('./routes/views.router.js');

app.use(express.static(`${__dirname}/public`));
app.use('/favicon.ico', express.static(`${__dirname}/public/img/favicon.png`));

// Handlebars
app.engine('handlebars', handlebarsInstance.engine());
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/public/views`); // Por qué ./public/views no funciona?

app.use('/', viewsRouter);

// API Routes
// app.use('/api/products', productsAPIRouter);
// app.use('/carts', cartsAPIRouter);
// app.use('/api/chats', chatAPIRouter);
// app.use('/api/users', usersAPIRouter);

// Routes
app.use('/products', productsRouter);
// app.use('/chats', chatRouter);
app.use('/sessions', sessionRouter);
app.use('/users', usersRouter);
app.use('/carts', cartsRouter);

// Home route -> products
app.get('/', (req, res) => { return res.redirect('/products'); });

// 404 Route
app.get('*', function (req, res) {
  res.status(404).render('logout', { message: 'Esta página no existe.' });
});

// Multer
//
//

// Server init
const httpServer = app.listen(port, () => console.log(`Server running at http://localhost:${port}`));

// Socket.io
const socketIOManager = require('./controllers/messages.controller.js');
const socket = new socketIOManager(httpServer);
socket.init();

// Authentication middleware
function authorization(req, res, next) {
  if (req.session.login) {
    return next();
  }
  return next();
}