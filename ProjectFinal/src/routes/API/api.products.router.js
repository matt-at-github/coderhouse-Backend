const express = require('express');
const router = express.Router();

const validator = require('../../shared/validator.js');
const ProductService = require('../../services/products.service.js');

router.get("/", async (req, res) => {

  try {

    if (!validator.isJsonString(req.query.filter) || !validator.isJsonString(req.query.sort)) {
      return res.status(400).send({ message: 'Filter or Sort is not a valid JSON' });
    }

    const filter = req.query.filter ? JSON.parse(req.query.filter) : undefined;
    const sort = req.query.sort ? JSON.parse(req.query.sort) : undefined;
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    const products = await ProductService.getProducts(filter, limit, page, sort);
    return res.send(products);
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.get("/:pid", async (req, res) => {

  try {
    const response = await ProductService.getProducts({ _id: req.params.pid });
    if (response.status !== 'success') {
      return res.status(404).send('Product not found.');
    }

    res.status(200).send(response);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/", async (req, res) => {

  try {

    const products = await ProductService.find();
    const validation = runBodyValidations(req.body, products);

    if (!validation.success) {
      return res.status(validation.code).send(validation.message);
    }

    const newProduct = new ProductService(req.body);
    await newProduct.save();

    res.status(201).send(newProduct);
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
    console.error(`Error: ${error}`);
  }
});

router.put("/:pid", async (req, res) => {

  try {
    const pid = req.params.pid;
    const updateProduct = await ProductService.findByIdAndUpdate(pid, req.body, { new: true });
    if (!updateProduct) { return res.status(404).send('Product not found.'); }

    return res.status(200).json({ 'updated': updateProduct });
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
    console.error(`Error: ${error}`);
  }
});

router.get("/:pid/delete", async (req, res) => {
  
  const pid = req.params.pid;

  const deleteProduct = await ProductService.findOneAndDelete({ id: pid });
  if (!deleteProduct) { return res.status(400).send(deleteProduct); }
  return res.status(202).json({ 'deleted': deleteProduct });
});

router.delete("/:pid", async (req, res) => {

  const pid = req.params.pid;

  const deleteProduct = await ProductService.findOneAndDelete({ id: pid });
  if (!deleteProduct) { return res.status(400).send('Product not found.'); }
  return res.status(202).json({ 'deleted': deleteProduct });
});

module.exports = router;

// Auxiliary methods
function runBodyValidations(toValidate, products) {

  const validateFields = (toValidate) => {
    const { title, description, price, thumbnails, code, stock, status = true } = { ...toValidate };
    const emptyEntries = [];
    Object.entries({ title, description, price, thumbnails, code, stock, status })
      .forEach(([key, value]) => {
        if (key !== 'thumbnails') {
          if (value === null || value === undefined || value.toString()?.trim() === '') {
            emptyEntries.push(key);
          }
        }
      });
    return (emptyEntries);
  };

  const invalidField = validateFields(toValidate);
  if (invalidField.length > 0) {
    return { success: false, message: `Fields [${invalidField.join(', ')}] empty. All fields are mandatory. Product was not added.`, code: 400 };
  }

  if (products.some(f => f.code === toValidate.code?.trim() ?? '')) {
    return { success: false, message: `Product code for '${toValidate.title}' is duplicated. Product was not added.`, code: 400 };
  }

  return { success: true };
}