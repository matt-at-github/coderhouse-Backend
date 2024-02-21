const express = require("express");
const router = express.Router();
// const UserModel = require('../services/session.service.js');

const SessionController = require('../controllers/session.controller.js');
const sessionController = new SessionController();

// Login
router.post("/login", async (req, res) => {
  try {
    const result = await sessionController.login(req);
    if (!result.success) {
      return res.status(result.code).render('logout', { error: true, title: 'Iniciar sesión', message: result.description });
    }
    res.status(result.code).redirect("/");
  } catch (error) {
    res.status(500).render('logout', { message: error });
  }
});

// Logout 
router.get("/logout", (req, res) => {
  try {
    const result = sessionController.logout(req);
    if (!result.success) {
      return res.status(result.code).render('logout', { error: true, title: 'Iniciar sesión', message: result.description });
    }
    return res.status(result.code).redirect('../../users/login');
  } catch (error) {
    res.status(500).render('logout', { title: 'Cerrar sesión', message: 'Ocurrió un problema al cerrar la sesión.' });
  }
});

module.exports = router;