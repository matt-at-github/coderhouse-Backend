const express = require('express');
const router = express.Router();

const CartModel = require('../../models/carts.model.js');
const ProductService = require('../../services/products.service.js');

function validateId(id) {
  const intID = parseInt(id);
  return Number.isInteger(intID) ? parseInt(intID) : false;
}

// Get all carts
router.get("/", async (req, res) => {

  const cart = await CartModel.find().populate('products.product');
  if (!cart) { return res.status(400).send('No cart found.'); }

  return res.status(200).send(cart);
});

// Get cart by ID
router.get("/:cid", async (req, res) => {

  const populate = req.query.populate === 'true';
  // const cid = validateId(req.params.cid);
  const cid = req.params.cid;
  // if (cid === false) { return res.status(400).send('The ID is invalid'); }

  const query = CartModel.findOne({ id: cid });
  if (populate) { query.populate('products.product'); }
  const cart = await query;

  if (!cart) { return res.status(400).send('No cart found.'); }

  return res.status(200).send(cart);
});

// Create new cart.
router.post("/", async (req, res) => {

  console.log('api.carts.router POST', req.body); // TODO: remove

  /* TODO
  IF user has not have a  Cart
    Create new cart
    Asign new Cart to user

  Add product to Cart
  */
  const cart = new CartModel({});

  if (req.body.productsId) {
    const productToAdd = await ProductService.findOne({ _id: req.body.productsId });
    cart.products.push({ product: productToAdd, quantity: 1 });
  }

  console.log('api.carts.router POST cart.id', cart); // TODO: remove
  const savedCart = await cart.save({ new: true });

  if (!savedCart) { return res.status(400).send('Error at saving new cart.'); }
  return res.status(200).send(savedCart);
});

// Add item to cart
router.post("/:cid/product/:pid", async (req, res) => {

  try {
    const cartId = req.params.cid;

    const cart = await CartModel.findOne({ _id: cartId });
    if (!cart) { throw 'No cart found'; }

    const prodId = req.params.pid;
    const productToAdd = await ProductService.findOne({ _id: prodId });
    if (!productToAdd) { throw 'No such product found'; }

    const productIndex = cart.products.findIndex(f => f.product.toString() === productToAdd._id.toString());
    if (productIndex !== -1) {
      productIndex.quantity += 1;
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: productToAdd._id, quantity: 1 });
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
    if (cartId === false) { return res.status(400).send('The cart ID is invalid.'); }

    const cart = await CartModel.findOne({ id: cartId });
    if (!cart) { return res.status(404).send({ message: 'No cart found.' }); }

    const prodId = req.params.pid;
    const productToAdd = await ProductService.findOne({ _id: prodId });
    if (!productToAdd) { return res.status(404).send({ message: 'No such product found.' }); }

    const productIndex = cart.products.findIndex(f => f.product.toString() === prodId.toString());
    if (productIndex !== -1) {
      cart.products[productIndex].quantity += req.body.quantity;
    }

    const newCart = await cart.save({ new: true });
    if (!newCart) { return res.status(400).send({ message: 'Unexpected error at saving cart.' }); }

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

    const cart = await CartModel.findOne({ id: cartId });
    if (!cart) { return res.status(404).send({ message: 'No cart found.' }); }

    cart.products = req.body;
    const newCart = await cart.save({ new: true });
    if (!newCart) { return res.status(400).send({ message: 'Unexpected error at saving cart.' }); }

    return res.status(200).send(newCart);

  } catch (error) {
    return res.status(500).send(error);
  }
});

// DELETE - Clear cart
router.delete("/:cid", async (req, res) => {

  try {

    const cartId = validateId(req.params.cid);
    if (cartId === false) { return res.status(400).send('The cart ID is invalid'); }

    const cart = await CartModel.findOne({ id: cartId });
    if (!cart) { return res.status(404).send({ message: 'No cart found.' }); }

    cart.products = [];

    const newCart = await cart.save({ new: true });
    if (!newCart) { return res.status(400).send({ message: 'Unexpected error at saving cart.' }); }

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

    const cart = await CartModel.findOne({ id: cartId });
    if (!cart) { return res.status(404).send({ message: 'No cart found.' }); }

    const productToAdd = await ProductService.findOne({ _id: req.params.pid });
    if (!productToAdd) { return res.status(404).send({ message: 'No such product found.' }); }

    const productIndex = cart.products.findIndex(f => f.product.toString() === productToAdd._id.toString());

    if (productIndex !== -1) {
      cart.products.splice(productIndex, 1);
      // cart.products[productIndex].quantity -= 1;
    }

    const newCart = await cart.save({ new: true });

    if (!newCart) { return res.status(400).send(newCart); }

    return res.status(200).send(newCart);
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;