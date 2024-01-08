const express = require('express');
const router = express.Router();

const path = require("node:path");

const CartManager = require('../controllers/CartManager.js');

const cartsDBPath = path.join(path.dirname(__dirname), '/db/carts.json');
const cartManager = new CartManager(cartsDBPath);

function validateId(id) {
  const intID = parseInt(id);
  return Number.isInteger(intID) ? parseInt(intID) : false;
}

router.get("/:cid", async (req, res) => {

  const id = validateId(req.params.cid);
  if (id === false) { return res.status(400).send('The ID is invalid'); }

  const getCart = await cartManager.getCartById(id);
  if (getCart.success === false) { return res.status(400).send(getCart.message); }

  return res.status(200).send(getCart.message.products);
});

router.post("/", async (req, res) => {

  const createCart = await cartManager.createNewCart(req.body.productsId);
  if (createCart.success === false) { return res.status(400).send(createCart.message); }
  return res.status(200).send(createCart.message);
});

router.post("/:cid/product/:pid", async (req, res) => {

  const cartId = validateId(req.params.cid);
  if (cartId === false) { return res.status(400).send('The cart ID is invalid'); }

  const prodId = validateId(req.params.pid);
  if (prodId === false) { return res.status(400).send('The product ID is invalid'); }

  const addItem = await cartManager.addItemToCartById(cartId, prodId);
  if (addItem.success === false) { return res.status(400).send(addItem.message); }

  return res.status(200).send(addItem.message);
});

module.exports = router;