const express = require('express');

const RealTimeProduct = require('../controllers/realTimeProducts.controller');
const realTimeProduct = new RealTimeProduct();

const { authenticateRole } = require('../middleware/checkrole');
const router = express.Router();

router.get('/',
  authenticateRole(['admin']),
  realTimeProduct.renderRealTimeProduct);

module.exports = router;