const express = require("express");
const router = express.Router();

const productManager = require('../DAO/models/products.model.js');

router.get("/", async (req, res) => {

  const limit = parseInt(req.query.limit) || undefined;
  const products = (await productManager.find()).slice(0, limit).map(m => {
    return {
      id: m.id,
      title: m.title,
      description: m.description,
      price: m.price,
      thumbnails: m.thumbnails,
      code: m.code,
      stock: m.stock
    };
  });
  return res.render('home', { products });
});

module.exports = router;