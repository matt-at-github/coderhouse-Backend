const express = require("express");
const router = express.Router();
const UserModel = require("../../models/users.model.js");
const SessionService = require('../../services/session.service.js');

router.post("/createAccount", async (req, res) => {

  console.log('api.users.router POST createAccount', req.body); // TODO: remove

  let { first_name, last_name, email, password, age } = req.body;
  age = Number(age);
  try {

    const response = await UserModel.create({ first_name, last_name, email, password, age });

    console.log('api.users.router POST createAccount response', response); // TODO: remove

    const login = await SessionService.login(req);
    console.log('api.sessions.router POST createAccount login', login); // TODO: remove
    if (!login.sucess) {
      return res.status(login.code).render('logout'), { title: 'Iniciar sesión', message: login.description };
    }

    console.log('api.sessions.router POST createAccount login', req.session); // TODO: remove

    res.status(login.code).redirect('/');
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Error al crear el usuario", description: error });
  }
});

module.exports = router;