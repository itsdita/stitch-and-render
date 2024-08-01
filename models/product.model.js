const db = require("../data/database"); //access to database

class Product {
  constructor(productData) {
    this.title = productData.title;
    this.summary = productData.summary;
    this.description = productData.description;
    this.price = +productData.price; //force conversion to number
    this.image = productData.image;
    this.imagePath = `product-data/images/${productData.image}`;
    this.imageUrl = `/products/assets/images/${productData.image}`;
  }
  async save() {
    const productData = {
      title: this.title,
      summary: this.summary,
      description: this.description,
      price: this.price,
      image: this.image,
    };
    await db.getDb().collection("products").insertOne(productData); // save the product to the database
  }
}

module.exports = Product;
