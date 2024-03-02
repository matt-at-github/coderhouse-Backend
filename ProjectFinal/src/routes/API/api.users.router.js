const express = require('express');
const router = express.Router();

const UserController = require('../../controllers/user.controller.js');
const userController = new UserController();

router.post('/createAccount', async (req, res) => {

  try {
    const result = await userController.createUser(req);
    if (!result.success) {
      return res.status(result.code).send({ message: result.message });
    }
    handleResponse(res, result);
  } catch (error) {
    res.status(500).send({ error: 'Error al crear el usuario', message: error });
  }
});

module.exports = router;

// Auxiliary methods
// Helper function for response.
const handleResponse = (res, result) => {
  if (result.success) {
    res.status(result.code).send(result.data);
  } else {
    res.status(result.code).send({ message: result.message });
  }
};