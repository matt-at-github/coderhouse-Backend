const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");

const PUERTO = 8080;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(session(
  {}
));

// Express-Session es un middleware para gestionar sesiones


app.listen(PUERTO, () => { console.log(`Server up! http://localhost:${PUERTO}`) })