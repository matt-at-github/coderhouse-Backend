const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const passport = require('passport');
const connectDB = require('./config/db.config.js');

require('./config/passport.config.js');

const userRoute = require('./routes/user.route.js');
const sessionRoute = require('./routes/session.route.js');  // Import session route

connectDB();

app.engine('hbs', handlebars.engine({ extname: 'hbs' }));
app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Use user and session routes
app.use('/user', userRoute);
app.use('/session', sessionRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
