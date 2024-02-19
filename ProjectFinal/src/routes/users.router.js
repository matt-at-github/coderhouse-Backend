const express = require("express");
const router = express.Router();

router.get('/createAccount', (req, res) => {
  res.render('createAccount');
});

// Login
router.get("/login", (req, res) => {
  return res.status(200).render('login');
});

module.exports = router;