const express = require('express');
const router = express.Router();

const Product = require('../DAO/models/products.model.js');

function validateId(id) {
  const intID = parseInt(id);
  return Number.isInteger(intID) ? parseInt(intID) : false;
}

router.get("/:pid", async (req, res) => {

  const pid = validateId(req.params.pid);
  if (pid === false) { return res.status(400).send('The ID is invalid'); }

  const product = await Product.findOne({ id: pid });
  if (!product) { return res.status(400).send('No product found.'); }

  return res.render('product', {
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price
  });
});

router.get("/api/:pid", async (req, res) => {

  const pid = validateId(req.params.pid);
  if (pid === false) { return res.status(400).send('The ID is invalid'); }

  const product = await Product.findOne({ id: pid });
  if (!product) { return res.status(400).send('No product found.'); }

  return res.send(product);
});

router.get("/api/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || undefined;
    console.log('limit', limit);
    const products = await Product.find();
    return res.send(products);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// router.post("/", async (req, res) => {

//   try {
//     const newProduct = new Product(req.body);
//     return res.status(201).send(newProduct);

//   } catch (error) {
//     res.status(500).send(`Error: ${error}`);
//     console.log(`Error: ${error}`);
//   }
// });

router.put("/api/:pid", async (req, res) => {

  const pid = validateId(req.params.pid);
  if (pid === false) { return res.status(400).send('The ID is invalid'); }

  const updateProduct = await Product.findOneAndUpdate({ id: pid }, req.body);
  console.log(JSON.stringify(updateProduct));
  if (!updateProduct) { return res.status(400).send('Problem updating, a field might be missing'); }
  return res.status(200).json(updateProduct);
});

router.get("/api/:pid/delete", async (req, res) => {

  const pid = validateId(req.params.pid);
  if (pid === false) { return res.status(400).send('The ID is invalid'); }

  const deleteProduct = await Product.findOneAndDelete({ id: pid });
  if (!deleteProduct) { return res.status(400).send(deleteProduct); }
  return res.status(202).redirect('/');
});

module.exports = router;