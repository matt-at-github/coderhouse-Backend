const express = require('express');
const router = express.Router();

router.get("/", async (req, res) => {

  try {
    // Sokect.io it is used on this view.
    res.status(200).render('chat');
  } catch (error) {
    return res.status(500).send({ message: error.message || 'Internal Server Error' });
  }
});

module.exports = router;