const express = require("express");
const router = express.Router();

const path = require("node:path");

const ProductManager = require('../controllers/ProductManager.js');

const productsDBPath = path.join(path.dirname(__dirname), '/db/products.json');
const productManager = new ProductManager(productsDBPath);

router.get("/", async (req, res) => {
  const limit = parseInt(req.query.limit) || undefined;
  console.log('limit', limit);
  const products = (await productManager.getProducts()).message.slice(0, limit);
  return res.render('home', { products });
});

module.exports = router;