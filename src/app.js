const PORT = 8080;
const STATIC = "";

const express = require('express');
const app = express();

// Middelware
app.use(express.json());
// app.use(express.urlencoded({ extended:true }));

// Routes 
const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");

app.use(STATIC, express.static(`${__dirname}/public`));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Server init
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}${STATIC}`));