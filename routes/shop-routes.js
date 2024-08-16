const express = require("express");
const router = express.Router();
const productsController = require("../controllers/shop.controller");

router.get("/shop", productsController.getAllProducts);

module.exports = router;