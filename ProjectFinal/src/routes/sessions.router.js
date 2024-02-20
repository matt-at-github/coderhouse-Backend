const express = require("express");
const router = express.Router();
const UserModel = require('../services/session.service.js');

// Login
router.post("/login", async (req, res) => {

  try {

    const login = await UserModel.login(req);
    if (!login.sucess) {
      return res.status(login.code).render('logout'), { title: 'Iniciar sesión', message: login.description };
    }

    console.log('sessions.router POST login', req.session); // TODO: remove

    res.status(login.code).redirect("/");
  } catch (error) {
    res.status(500).render('logout', { message: error });
  }
});

// Logout 
router.get("/logout", (req, res) => {

  try {
    if (UserModel.logout(req.session)) {
      res.status(200).render('logout', { title: 'Cerrar sesión', message: 'Sesión cerrada.' });
    }
  } catch (error) {
    res.status(500).render('logout', { title: 'Cerrar sesión', message: 'Ocurrió un problema al cerrar la sesión.' });
  }
});

module.exports = router;