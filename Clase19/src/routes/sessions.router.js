const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");

// Login
router.post("/sessionLogin", async (req, res) => {

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
    res.status(200).send({ message: "Login correcto." });
  } catch (error) {
    res.status(error.code ?? 400).send(`Error en el login. ${error.description ?? error}`);
  }
})

router.get("/sessionLogout", (req, res) => {

  if (req.session.login) {
    req.session.destroy();
    return res.status(200).send({ message: 'Loged out.' })
  }
  res.status(400).send({ message: 'No session found.' })
})

module.exports = router;