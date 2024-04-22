const { cookieParserConfig: cookie_parser, port } = require('./config/config.js');

const express = require('express');
const app = express();
const handlebarsInstance = require('express-handlebars');

const cookieParser = require('cookie-parser');
const cors = require('cors');

const addLogger = require('./utils/logger.js');
app.use(addLogger);

// Mongo connection
require('./db/db.connection.js');

//Passport: 
const passport = require('passport');
const initializePassport = require('./config/passport.config.js');
initializePassport();
app.use(passport.initialize());

// Middelware
const errorHandler = require('./middleware/errorHandler.js');
app.use(express.json());
app.use(cookieParser(cookie_parser.secret_key));
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);
app.use(cors());

// Routes 
const { authenticateRole } = require('./middleware/checkrole.js');

const productsRouter = require('./routes/products.router');
const productsAPIRouter = require('./routes/API/api.products.router.js');
const cartsRouter = require('./routes/carts.router.js');
const chatRouter = require('./routes/chat.router.js');
const usersRouter = require('./routes/users.router.js');
const usersAPIRouter = require('./routes/API/api.users.router.js');
const viewsRouter = require('./routes/views.router.js');
const realTimeProductRouter = require('./routes/realtimeProducts.router.js');

app.use(express.static(`${__dirname}/public`));
app.use('/favicon.ico', express.static(`${__dirname}/public/img/favicon.png`));

// Handlebars
app.engine('handlebars', handlebarsInstance.engine());
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/public/views`); // Por qué ./public/views no funciona?

// User information injection
const extractUserInfo = require('./middleware/userInformationInject.js');
app.use(extractUserInfo);

app.use('/', viewsRouter);

// API Routes
app.use('/api/products', productsAPIRouter);
app.use('/api/users', usersAPIRouter);

// Routes
app.use('/products', productsRouter);
app.use('/chats', authenticateRole(['user']), chatRouter);
app.use('/users', usersRouter);
app.use('/carts', cartsRouter);
app.use('/realtimeProducts', realTimeProductRouter); // TODO: Implementar campo categoria. + Stock actual

// Home route -> login
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
const socketIOManager = require('./controllers/socketIO.controller.js');
const socket = new socketIOManager(httpServer);
socket.init();
