const express = require('express');
const router = express.Router()

const path = require("node:path")

const ProductManager = require('../ProductManager.js');

const nodePath = path.join(path.dirname(__dirname),'/repositories/myDatabase.json');
const manager = new ProductManager(nodePath)

router.get("/:cid", async (req, res) => {

});

router.post("/:cid", async (req, res) => {

});

module.exports = router;