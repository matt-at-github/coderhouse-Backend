const express = require("express");
const router = express.Router();

const path = require("node:path");

const ProductManager = require('../controllers/ProductManager.js');

const productsDBPath = path.join(path.dirname(__dirname), '/db/products.json');
const productManager = new ProductManager(productsDBPath);

router.get("/", async (req, res) => {

  const products = (await productManager.getProducts()).message;
  res.render('home',
    { data: 'Esto es una prueba', products }
  );
});

module.exports = router;