const express = require('express');
const router = express.Router();

const Cart = require('../models/carts.model.js');
const Product = require('../services/products.service.js');

function validateId(id) {
  const intID = parseInt(id);
  return Number.isInteger(intID) ? parseInt(intID) : false;
}

// Get all carts
router.get("/", async (req, res) => {

  const cart = await Cart.find().populate('productos.producto');
  if (!cart) { return res.status(400).send('No cart found.'); }

  return res.status(200).send(cart);
});

// Get cart by ID
router.get("/:cid", async (req, res) => {

  const populate = req.query.populate === 'true';
  const cid = validateId(req.params.cid);
  if (cid === false) { return res.status(400).send('The ID is invalid'); }

  const query = Cart.findOne({ id: cid });
  if (populate) { query.populate('productos.producto'); }
  const cart = await query;

  if (!cart) { return res.status(400).send('No cart found.'); }

  return res.status(200).send(cart);
});

// Create new cart.
router.post("/", async (req, res) => {

  const carts = (await Cart.find());

  const newCart = new Cart();
  newCart.id = Number(carts.at(-1)?.id ?? 0) + 1;

  const createCart = await newCart.save();

  const cart = await Cart.findOne({ id: createCart.id });

  const productToAdd = await Product.findOne({ _id: req.body.productsId });
  cart.productos.push({ producto: productToAdd, cantidad: 1 });

  const savedCart = await cart.save({ new: true });

  if (!savedCart) { return res.status(400).send('Error at saving new cart.'); }
  return res.status(200).send(savedCart);
});

// Add item to cart
router.post("/:cid/product/:pid", async (req, res) => {

  try {
    const cartId = validateId(req.params.cid);
    if (cartId === false) { return res.status(400).send('The cart ID is invalid'); }

    const cart = await Cart.findOne({ id: cartId });
    if (!cart) { throw 'No cart found'; }

    const prodId = req.params.pid;
    const productToAdd = await Product.findOne({ _id: prodId });
    if (!productToAdd) { throw 'No such product found'; }

    const productIndex = cart.productos.findIndex(f => f.producto.toString() === productToAdd._id.toString());
    if (productIndex !== -1) {
      productIndex.cantidad += 1;
      cart.productos[productIndex].cantidad += 1;
    } else {
      cart.productos.push({ producto: productToAdd._id, cantidad: 1 });
    }

    const newCart = await cart.save({ new: true });

    if (!newCart) { return res.status(400).send(newCart); }

    return res.status(200).send(newCart);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// PUT - Edit cart's product quantity
router.put('/:cid/products/:pid', async (req, res) => {

  try {

    const cartId = validateId(req.params.cid);
    if (cartId === false) { return res.status(400).send('The cart ID is invalid'); }

    const cart = await Cart.findOne({ id: cartId });
    if (!cart) { throw 'No cart found'; }

    const prodId = req.params.pid;
    const productToAdd = await Product.findOne({ _id: prodId });
    if (!productToAdd) { throw 'No such product found'; }

    const productIndex = cart.productos.findIndex(f => f.producto.toString() === prodId.toString());
    if (productIndex !== -1) {
      cart.productos[productIndex].cantidad += req.body.cantidad;
    }

    const newCart = await cart.save({ new: true });
    if (!newCart) { return res.status(400).send(newCart); }

    return res.status(200).send(newCart);

  } catch (error) {
    return res.status(500).send(error);
  }
});

// PUT - Edit cart
router.put('/:cid', async (req, res) => {

  try {

    const cartId = validateId(req.params.cid);
    if (cartId === false) { return res.status(400).send('The cart ID is invalid'); }

    const cart = await Cart.findOne({ id: cartId });
    if (!cart) { throw 'No cart found'; }

    cart.productos = req.body;
    const newCart = await cart.save({ new: true });
    if (!newCart) { return res.status(400).send(newCart); }

    return res.status(200).send(newCart);

  } catch (error) {
    return res.status(500).send(error);
  }
});

// router.get("/:cid/delete", async (req, res) => {

//   const cid = validateId(req.params.cid);
//   if (cid === false) { return res.status(400).send('The ID is invalid'); }

//   const cart = await Cart.findOneAndDelete({ id: cid });
//   if (!cart) { return res.status(400).send('No cart found.'); }

//   return res.status(200).send(cart);
// });

// DELETE - Clear cart
router.delete("/:cid", async (req, res) => {

  try {

    const cartId = validateId(req.params.cid);
    if (cartId === false) { return res.status(400).send('The cart ID is invalid'); }

    const cart = await Cart.findOne({ id: cartId });
    if (!cart) { throw 'No cart found'; }

    cart.productos = [];

    const newCart = await cart.save({ new: true });
    if (!newCart) { return res.status(400).send(newCart); }

    return res.status(200).send(newCart);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// DELETE - Remove item from cart
router.delete("/:cid/product/:pid", async (req, res) => {

  try {

    const cartId = validateId(req.params.cid);
    if (cartId === false) { return res.status(400).send('The cart ID is invalid'); }

    const cart = await Cart.findOne({ id: cartId });
    if (!cart) { throw 'No cart found'; }

    const productToAdd = await Product.findOne({ _id: req.params.pid });
    if (!productToAdd) { throw 'No such product found'; }

    const productIndex = cart.productos.findIndex(f => f.producto.toString() === productToAdd._id.toString());

    if (productIndex !== -1) {
      cart.productos.splice(productIndex, 1);
      // cart.productos[productIndex].cantidad -= 1;
    }

    const newCart = await cart.save({ new: true });

    if (!newCart) { return res.status(400).send(newCart); }

    return res.status(200).send(newCart);
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;