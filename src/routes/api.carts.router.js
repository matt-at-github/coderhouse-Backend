const express = require('express');
const router = express.Router();

const cartController = require('../DAO/models/carts.model.js');

function validateId(id) {
  const intID = parseInt(id);
  return Number.isInteger(intID) ? parseInt(intID) : false;
}

router.get("/", async (req, res) => {

  const cart = await cartController.find();
  if (!cart) { return res.status(400).send('No cart found.'); }

  return res.status(200).send(cart);
});

router.get("/:cid", async (req, res) => {

  const cid = validateId(req.params.cid);
  if (cid === false) { return res.status(400).send('The ID is invalid'); }

  const cart = await cartController.findOne({ id: cid });
  if (!cart) { return res.status(400).send('No cart found.'); }

  return res.status(200).send(cart);
});

router.post("/", async (req, res) => {

  const newCart = new cartController();
  newCart.productos.push({ id: req.body.productsId, cantidad: 1 });

  const createCart = await newCart.save();

  if (!createCart) { return res.status(400).send('Error at saving new cart.'); }
  return res.status(200).send(createCart);
});

router.post("/:cid/product/:pid", async (req, res) => {

  const cartId = validateId(req.params.cid);
  if (cartId === false) { return res.status(400).send('The cart ID is invalid'); }

  const prodId = validateId(req.params.pid);
  if (prodId === false) { return res.status(400).send('The product ID is invalid'); }

  const cart = await cartController.findOne({ id: cartId });
  console.log(cart.productos);
  const product = cart.productos.find(f => f.id === prodId);
  if (product) {
    product.cantidad += 1;
  } else {
    cart.productos.push({ id: prodId, cantidad: 1 });
  }

  const newCart = await cart.save({ new: true });

  if (!newCart) { return res.status(400).send(newCart); }

  return res.status(200).send(newCart);
});

router.get("/:cid/delete", async (req, res) => {

  const cid = validateId(req.params.cid);
  if (cid === false) { return res.status(400).send('The ID is invalid'); }

  const cart = await cartController.findOneAndDelete({ id: cid });
  if (!cart) { return res.status(400).send('No cart found.'); }

  return res.status(200).send(cart);
});

module.exports = router;