const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');

const PUERTO = 8080;
const secret = 'mySecretKey'


// Middlewares
app.use(cookieParser(secret));
app.use(session({
  secret: secret,
  resave: true, // permite mantener activa la sesión frente a la inactividad del usuario.
  saveUninitialized: true // permite guardar cualquier sesión aún cuando el objecto de sesión esté vacio.
}));
//** Authentication
function auth(req, res, next) { // next permite pasar al siguiente middleware si este tiene éxito.
  console.log(req.session)
  if (req.session.user === "matt" && req.session.admin) {
    return next();
  }
  return res.status(401).send('Unauthorized');
}

// Rutes
app.get('/', (req, res) => {
  res.send('Hola mundo')
})

app.get('/setCookie', (req, res) => {
  res.cookie('cookieFirmada', 'Mi primera cookie, firmada.', { maxAge: 60000, signed: true })
    .cookie('cookieNoFirmada', 'Mi primera cookie.', { maxAge: 60000 })
    .send('Cookies set.');
})

app.get('/readCookie', (req, res) => {

  res.send(`${JSON.stringify(req.cookies)} | ${JSON.stringify(req.signedCookies.cookieFirmada)}`)
})

app.get('/deleteCookie', (req, res) => {
  res.clearCookie('cookieFirmada')
    .clearCookie('cookieNoFirmada')
    .send('Cookie deleted!');
})

app.get('/session', (req, res) => {

  if (req.session.counter) {
    req.session.counter++;
    res.send(`Visitates el sitio: ${req.session.counter} veces.`)
  } else {
    req.session.counter = 1;
    res.send('Bienvenido a la web!')
  }
})

app.get('/login', (req, res) => {

  const { user, password } = req.query;
  if (user === "matt" && password === "123456") {
    req.session.user = user;
    req.session.admin = true;
    res.status(200).send(`Bienvenido a la app ${user}.`);
  } else {
    res.status(404).send('Datos incorrectos.');
  }
})

app.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy((error) => {
      if (error) { res.status(500).send(`error! ${error}`) }
      else { res.status(200).send('Usuario deslogeado'); }
    });
  }
})

// Utilización de un 'custom' middleware.
app.get('/account', auth, (req, res) => {
  res.send(`Mostrando la cuenta de ${req.session.user}${req.session.admin ? ', administrador' : ''}.`);
});

app.listen(PUERTO, () => {
  console.log(`Server up at http://localhost:${PUERTO}`)
})