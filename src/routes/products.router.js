const express = require('express');
const router = express.Router()

const path = require("node:path")

const ProductManager = require('../ProductManager.js');

const nodePath = path.join(path.dirname(__dirname), '/db/products.json');
const productManager = new ProductManager(nodePath)

function validateId(id) {
  const intID = parseInt(id);
  return Number.isInteger(intID) ? parseInt(intID) : false;
}

router.get("/:pid", async (req, res) => {

  const id = validateId(req.params.pid)
  if (id === false) { return res.send('The ID is invalid'); }

  const product = await productManager.getProductById(id);
  return res.send(product || `Product of ID ${id} does not exists.`).status(200);
});

router.get("/", async (req, res) => {
  const limit = parseInt(req.query.limit) || undefined;
  return res.send((await productManager.getProducts()).slice(0, limit)).status(200);
});

router.post("/", async (req, res) => {

  const { title, description, price, thumbnails, code, stock, status } = { ...req.body };
  const addProduct = await productManager.addProduct(title, description, price, thumbnails, code, stock, status);
  if (addProduct.success === false) { return res.send(addProduct).status(400); }
  return res.send('Product added successfuly').status(201);
})

router.put("/:pid", async (req, res) => {

  const id = validateId(req.params.pid)
  if (id === false) { return res.send('The ID is invalid'); }

  const updated = productManager.updateProductById(id, { ...req.body });
  if (updated !== true) { return res.send(updated).status(400); }
  return res.send('Product udpated successfuly').status(204);
})

router.delete("/:pid", async (req, res) => {

  const id = validateId(req.params.pid)
  if (id === false) { return res.send('The ID is invalid'); }

  const deleted = productManager.deleteProductByID(id);
  if (deleted !== true) { return res.send(deleted).status(400); }
  return res.send('Product deleted successfuly').status(202);
})

module.exports = router;