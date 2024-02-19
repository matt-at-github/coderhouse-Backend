const express = require("express");
const router = express.Router();
const UserModel = require("../../models/users.model.js");

router.post("/createAccount", async (req, res) => {
  console.log(req.body);
  let { first_name, last_name, email, password, age } = req.body;
  age = Number(age);
  try {
    await UserModel.create({ first_name, last_name, email, password, age });
    req.session.login = true;
    res.status(200).redirect('/');
  } catch (error) {
    res.status(400).send({ error: "Error al crear el usuario", description: error });
  }
});

module.exports = router;