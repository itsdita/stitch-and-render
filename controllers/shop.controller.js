const { get } = require("mongoose");
const Product = require("../models/product.model");

async function getAllProducts(req, res, next){
    try {
        const products = await Product.findAll();
        res.render("shared/shop", {products: products});
    } catch (error) {
        next(error);
    }  
}

async function getProduct(req, res, next) {
    try {
      const product = await Product.findById(req.params.id);
      res.render("shared/product-page", { product: product });
    } catch (error) {
      next(error);
    }
  }

module.exports = {
    getAllProducts: getAllProducts,
    getProduct: getProduct
}