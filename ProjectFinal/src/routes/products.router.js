const express = require('express');
const router = express.Router();

const ProductService = require('../DAO/services/products.service.js');

function validateId(id) {
  const intID = parseInt(id);
  return Number.isInteger(intID) ? parseInt(intID) : false;
}

router.get("/", async (req, res) => {

  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const filter = undefined;
  const sort = undefined;

  const response = await ProductService.getProducts(filter, limit, page, sort);

  return res.render('products', {
    products: response.payload,
    totalDocs: response.totalDocs,
    page: response.page,
    totalPages: response.totalPages,
    limit: response.limit,
    hasNextPage: response.hasNextPage,
    nextPage: response.nextPage,
    hasPrevPage: response.hasPrevPage,
    prevPage: response.prevPage,
    pagingCounter: response.pagingCounter
  });
});

router.get("/:pid", async (req, res) => {

  try {
    const pid = validateId(req.params.pid);
    if (pid === false) { return res.status(400).send('The ID is invalid'); }

    const response = await ProductService.getProducts({ id: pid });

    if (response.status === 'success') {

      const product = response.payload[0];
      return res.render('product', {
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price
      });
    }
  } catch (error) {
    return res.status(500).send(error);
  }
});

// router.get("/api/:pid", async (req, res) => {

//   const pid = validateId(req.params.pid);
//   if (pid === false) { return res.status(400).send('The ID is invalid'); }

//   const product = await ProductService.findOne({ id: pid });
//   if (!product) { return res.status(400).send('No product found.'); }

//   return res.send(product);
// });

// router.get("/api/", async (req, res) => {
//   try {
//     const limit = parseInt(req.query.limit) || undefined;
//     console.log('limit', limit);
//     const products = await ProductService.find();
//     return res.send(products);
//   } catch (error) {
//     return res.status(500).send(error);
//   }
// });

// router.post("/", async (req, res) => {

//   try {
//     const newProduct = new Product(req.body);
//     return res.status(201).send(newProduct);

//   } catch (error) {
//     res.status(500).send(`Error: ${error}`);
//     console.log(`Error: ${error}`);
//   }
// });

// router.put("/api/:pid", async (req, res) => {

//   const pid = validateId(req.params.pid);
//   if (pid === false) { return res.status(400).send('The ID is invalid'); }

//   const updateProduct = await ProductService.findOneAndUpdate({ id: pid }, req.body);
//   console.log(JSON.stringify(updateProduct));
//   if (!updateProduct) { return res.status(400).send('Problem updating, a field might be missing'); }
//   return res.status(200).json(updateProduct);
// });

// router.get("/api/:pid/delete", async (req, res) => {

//   const pid = validateId(req.params.pid);
//   if (pid === false) { return res.status(400).send('The ID is invalid'); }

//   const deleteProduct = await ProductService.findOneAndDelete({ id: pid });
//   if (!deleteProduct) { return res.status(400).send(deleteProduct); }
//   return res.status(202).redirect('/');
// });

module.exports = router;