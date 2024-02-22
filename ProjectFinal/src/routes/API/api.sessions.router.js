const express = require("express");
const router = express.Router();

const SessionController = require('../../controllers/session.controller.js');
const sessionController = new SessionController();

// Login
router.post("/login", async (req, res) => {
  try {
    const result = await sessionController.login(req);
    handleResponse(res, result);
  } catch (error) {
    res.status(500).send(error.message || 'Internal Server Error');
  }
});

// Logout
router.get("/logout", (req, res) => {
  try {
    const result = sessionController.logout(req);
    handleResponse(res, result);
  } catch (error) {
    res.status(500).send(error.message || 'Internal Server Error');
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