const express = require('express');
const app = express();
const handlebars = require('express-handlebars')


const PORT = 8080;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./src/public'))

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', './src/public/views')

//Routes
const mailer = require('./nodemailerHandlebars.js');

app.get('/', (req, res) => { res.send('works') })

app.use('/mail', mailer);

app.listen(PORT, () => { console.log(`Sever up at http://localhost:${PORT}`) });