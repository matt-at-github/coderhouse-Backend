const express = require('express');
const app = express();

const ProductManager = require('./ProductManager.js');
const manager = new ProductManager(`${__dirname}/myDatabase.json`)

app.get("/", async (req, res) => {
  res.send(`HOME`)
});


app.get("/products/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  if (Number.isInteger(id)) {
    const products = await manager.getProductById(id);

    return res.send(products || `Product of ID ${id} does not exists.`);
  }
  return res.send('The ID is invalid');
});

app.get("/products", async (req, res) => {
  const limit = parseInt(req.query.limit) || undefined;
  const products = await manager.getProducts();
  return res.send(products.slice(0, limit));
});

const PORT = 8080;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`))
