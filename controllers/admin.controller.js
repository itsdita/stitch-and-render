const Product = require("../models/product.model");

async function getProducts(req, res) {
    try {
        const products = await Product.findAll();
        res.render("admin/products/admin-all-products", { products: products });
    } catch (error){
        next(error);
        return;
    }
}

function getNewProducts(req, res) {
  res.render("admin/products/new-product");
}

async function createNewProduct(req, res) {
  const product = new Product({
    ...req.body,
    image: req.file.filename,
  });

  try {
    await product.save();
  } catch (error) {
    mext(error);
    return;
  }

  res.redirect("/admin/products");
}

module.exports = {
  getProducts: getProducts,
  getNewProducts: getNewProducts,
  createNewProduct: createNewProduct,
};
