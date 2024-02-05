const express = require('express');
const router = express.Router();

const ProductModel = require('../DAO/models/products.model.js');

function validateId(id) {
  const intID = parseInt(id);
  return Number.isInteger(intID) ? parseInt(intID) : false;
}

router.get("/:pid", async (req, res) => {

  try {
    const pid = validateId(req.params.pid);
    if (pid === false) { return res.status(400).send('The ID is invalid'); }

    const product = await ProductModel.findOne({ id: pid });
    if (!product) { return res.status(400).send('No product found.'); }

    return res.send(product);
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || undefined;
    const products = (await ProductModel.find()).slice(0, limit);
    return res.send(products);
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.post("/", async (req, res) => {

  try {

    const products = (await ProductModel.find());
    runBodyValidations(req.body, products);

    req.body['id'] = Number(products.at(-1)?.id ?? 0) + 1;

    const newProduct = new ProductModel(req.body);
    await newProduct.save();
    return res.status(201).send(newProduct);

  } catch (error) {
    res.status(500).send(`Error: ${error}`);
    console.error(`Error: ${error}`);
  }
});

router.put("/:pid", async (req, res) => {

  try {
    const pid = validateId(req.params.pid);
    if (pid === false) { return res.status(400).send('The ID is invalid'); }

    const updateProduct = await ProductModel.findOneAndUpdate({ id: pid }, req.body, { new: true });
    if (!updateProduct) { return res.status(400).send('Problem updating, a field might be missing'); }
    return res.status(200).json({ 'updated': updateProduct });
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
    console.error(`Error: ${error}`);
  }
});

router.get("/:pid/delete", async (req, res) => {

  const pid = validateId(req.params.pid);
  if (pid === false) { return res.status(400).send('The ID is invalid'); }

  const deleteProduct = await ProductModel.findOneAndDelete({ id: pid });
  if (!deleteProduct) { return res.status(400).send(deleteProduct); }
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
    throw `Fields [${invalidField.join(', ')}] empty. All fields are mandatory. Product was not added.`;
  }

  if (products.some(f => f.code === toValidate.code?.trim() ?? '')) {
    return { success: false, message: `Product code for '${toValidate.title}' is duplicated. Product was not added.` };
  }
}