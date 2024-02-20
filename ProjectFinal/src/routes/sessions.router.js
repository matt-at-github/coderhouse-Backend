const express = require("express");
const router = express.Router();
const UserModel = require('../services/session.service.js');

// Login
router.post("/login", async (req, res) => {

  try {

    console.log('sessions.router POST login 0', req.session); // TODO: remove

    const login = await UserModel.login(req);
    if (!login.sucess) {
      return res.status(login.code).render('logout', { error: true, title: 'Iniciar sesión', message: login.description });
    }

    console.log('sessions.router POST login 1', req.session); // TODO: remove
    res.status(login.code).redirect("/");
  } catch (error) {
    res.status(500).render('logout', { message: error });
  }
});

// Logout 
router.get("/logout", (req, res) => {
  try {
    console.log('sessions.router GET logout 0', req.session); // TODO: remove
    if (UserModel.logout(req)) {
      console.log('sessions.router GET logout 1', req.session); // TODO: remove
      res.status(200).redirect('../../users/login');
    }
  } catch (error) {
    res.status(500).render('logout', { title: 'Cerrar sesión', message: 'Ocurrió un problema al cerrar la sesión.' });
  }
});

module.exports = router;