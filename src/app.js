const express = require('express');
const app = express();

const ProductManager = require('./ProductManager.js');
const manager = new ProductManager(`${__dirname}/myDatabase.json`)

const styles = {
  nav: "background: black; padding: 10px; text-align: left; font-size:16px;",
  subNav: "background: grey; padding: 10px; text-align: left; font-size:16px;",
  a: "color:white; margin-right:20px; text-decoration:none; border: 1px solid white; padding: 5px",
  button: "background-color: grey; border: none; color: white; padding: 10px 26px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px;"
}

const nav = (description) => {
  return `
<h1>${description}</h1>
<nav style="${styles.nav}">
  <a style="${styles.a}" href="/">Home</a></li>
  <a style="${styles.a}" href="/products">Products</a></li>
</nav>
`}
app.get("/", async (req, res) => {
  res.send(nav('Welcome to Home'))
});

app.get("/products/:pid", async (req, res) => {

  let response;
  const id = parseInt(req.params.pid);
  if (Number.isInteger(id)) {
    const products = await manager.getProductById(id);
    response = products || `Product of ID ${id} does not exists.`
  } else {
    response = res.send('The ID is invalid');
  }
  return res.send(`
  ${nav('Product by ID')}<br>
  <h2>ID: ${id}</h2>
  <a style="${styles.button}" href="/products">< Back</a>
  ${`<pre>${JSON.stringify(response, undefined, 2)}</pre>`}
  `);
});

app.get("/products", async (req, res) => {

  const limit = parseInt(req.query.limit) || undefined;
  const products = await manager.getProducts();

  const links = [];
  products.forEach(m => {
    links.push(`${`<a style="${styles.a}" href="products/${m.id}"> ${m.title} </a>`}`)
  });

  return res.send(`
  ${nav('All Products')}<br>
  <h2>Products:</h2>
  <nav style="${styles.subNav}">
    ${links.join('')}
  </nav >
  <br>
    ${products.slice(0, limit).map(m => `<pre>${JSON.stringify(m, undefined, 2)}</pre>`)}
    `);
});

const PORT = 8080;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`))
