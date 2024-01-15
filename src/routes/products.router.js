const express = require('express');
const router = express.Router();

const path = require("node:path");

const ProductManager = require('../controllers/ProductManager.js');

const productsDBPath = path.join(path.dirname(__dirname), '/db/products.json');
const productManager = new ProductManager(productsDBPath);

function validateId(id) {
  const intID = parseInt(id);
  return Number.isInteger(intID) ? parseInt(intID) : false;
}

router.get("/:pid", async (req, res) => {

  const id = validateId(req.params.pid);
  if (id === false) { return res.status(400).send('The ID is invalid'); }

  const getProduct = await productManager.getProductById(id);
  if (getProduct.success === false) { return res.status(400).send(getProduct.message); }
  console.log(getProduct.message)
  // return res.status(200).send(getProduct.message);
  return res.render('products', { data: getProduct.message });
});

router.get("/", async (req, res) => {
  const limit = parseInt(req.query.limit) || undefined;
  return res.status(200).send((await productManager.getProducts()).message.slice(0, limit));
});

router.post("/", async (req, res) => {

  const { title, description, price, thumbnails, code, stock, status } = { ...req.body };
  const addProduct = await productManager.addProduct(title, description, price, thumbnails, code, stock, status);
  if (addProduct.success === false) { return res.status(400).send(addProduct.message); }
  return res.status(201).send(addProduct.message);
});

router.put("/:pid", async (req, res) => {

  const id = validateId(req.params.pid);
  if (id === false) { return res.status(400).send('The ID is invalid'); }

  const { title, description, price, thumbnails, code, stock, status } = { ...req.body };
  const updateProduct = await productManager.updateProductById(id, title, description, price, thumbnails, code, stock, status);
  console.log(JSON.stringify(updateProduct));
  if (updateProduct.success === false) { return res.status(400).send(updateProduct.message); }
  return res.status(200).json(updateProduct.message);
});

router.delete("/:pid", async (req, res) => {

  const id = validateId(req.params.pid);
  if (id === false) { return res.status(400).send('The ID is invalid'); }

  const deleteProduct = await productManager.deleteProductByID(id);
  if (deleteProduct.success === false) { return res.status(400).send(deleteProduct.message); }
  return res.status(202).send(deleteProduct.message);
});

module.exports = router;