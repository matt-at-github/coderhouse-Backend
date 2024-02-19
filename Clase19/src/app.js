const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session"); // Express-Session es un middleware para gestionar sesiones
const MongoStore = require("connect-mongo");
require("./db.connection.js");

const userRouter = require("./routes/user.router.js");
const sessionRouter = require("./routes/sessions.router.js");

const PUERTO = 8080;
const secret = 'mySecretKey'

// Middlewares
app.use(express.json());
app.use(cookieParser(secret));

// esta metodología de almacenamiento de sesion nos deja muchos archivos muertos...
// session-file-store es un módulo para gestionar la persistencia de las sesiones en el servidor
// const FileStore = require("session-file-store"); 
// const fileStore = FileStore(session); // Inicialización del módulo
// const fileStorage = new fileStore({ 
//   path: "./src/sessions", // dónde se van a guardar
//   ttl: 5, // tiempo de vida del archivo (en segundos)
//   retries: 2, // re intentos de lectura.
// });

const mongoStorage = MongoStore.create({
  mongoUrl: 'mongodb+srv://matiasnicolasmoresi:Cn9o0TqM4pQak0kx@cluster0.5jasxmm.mongodb.net/OnlyShop?retryWrites=true&w=majority',
  ttl: 60 * 10
});

app.use(session({
  secret: secret,
  resave: true, // permite mantener activa la sesión frente a la inactividad del usuario.
  saveUninitialized: true, // permite guardar cualquier sesión aún cuando el objecto de sesión esté vacio.
  store: mongoStorage  // seteamos el método de gestión de la persistencia
}));

app.get("/login", (req, res) => {

  let user = req.query.user;
  req.session.user = user;
  console.log(req.session)
  res.send(`Usuario '${user}' guardado.`)
})

app.get("/user", async (req, res) => {

  console.log(req.session)
  if (req.session.user) {
    return res.send(`Hola ${req.session.user}`);
  }

  res.send('No login registered');
})

app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);

app.listen(PUERTO, () => { console.log(`Server up! http://localhost:${PUERTO}`) })