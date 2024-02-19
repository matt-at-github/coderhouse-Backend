const express = require("express");
const router = express.Router();
const UserModel = require("../../models/users.model.js");

// Login
router.post("/login", async (req, res) => {

  const { email, password } = req.body;

  try {

    const user = await UserModel.findOne({ email: email });
    if (!user) {
      throw { description: 'Usuario no encontrado.', code: 404 };
    }

    if (user.password !== password) {
      throw { description: 'Contraseña incorrecta.', code: 401 };
    }

    req.session.login = true;
    req.session.userName = user.first_name;

    console.log(req.session);

    res.status(200).redirect("/");
  } catch (error) {
    res.status(error.code ?? 400).send(`Error en el login. ${error.description ?? error}`);
  }
});

// Logout
router.get("/logout", (req, res) => {

  if (req?.session?.login) {
    req.session.destroy();
    return res.status(200).render('logout');
  }
  res.status(400).render('logout', { error: true, message: 'Ups, sesión no encontrada.' });
});

module.exports = router;