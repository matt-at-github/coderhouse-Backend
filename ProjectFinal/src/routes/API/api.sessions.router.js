const express = require("express");
const router = express.Router();
const UserService = require('../../services/session.service.js');

// Login
router.post("/login", async (req, res) => {

  try {

    const login = await UserService.login(req);
    if (!login.sucess) {
      return res.status(login.code).render('logout'), { title: 'Iniciar sesión', message: login.description };
    }

    console.log('api.sessions.router POST login', req.session); // TODO: remove

    res.status(login.code);
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

// Logout
router.get("/logout", (req, res) => {

  try {
    console.log('api.sessions.router GET logout', req.session); // TODO: remove
    if (UserService.logout(req)) {
      res.status(200).send({ message: 'Session closed.' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Session termination problem.' });
  }

});

module.exports = router;