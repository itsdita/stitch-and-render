const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");
const imageUploadMiddleware = require("../middlewares/image-upload");

//admin/products
router.get("/products", adminController.getProducts);

//admin/products/new
router.get("/products/new", adminController.getNewProducts);

router.post("/products", imageUploadMiddleware, adminController.createNewProduct);

module.exports = router;