const mongodb = require("mongodb"); //import mongodb
const db = require("../data/database"); //access to database

class Product {
  constructor(productData) {
    this.title = productData.title;
    this.summary = productData.summary;
    this.description = productData.description;
    this.price = +productData.price; //force conversion to number
    this.image = productData.image;
    this.updateImageData();
    if (productData._id) {
      this.id = productData._id.toString();
    }
  }

  static async findById(productId) {
    let prodId;
    try {
      prodId = new mongodb.ObjectId(productId);
    } catch (error) {
      error.code = 404;
      throw error;
    }
    const product = await db
      .getDb()
      .collection("products")
      .findOne({ _id: prodId });
    if (!product) {
      const error = new Error("Product not found");
      error.code = 404;
      throw error;
    }
    return new Product(product);
  }

  static async findAll() {
    const products = await db.getDb().collection("products").find().toArray();

    return products.map(function (productDocument) {
      return new Product(productDocument);
    });
  }

  updateImageData(){
    this.imagePath = `product-data/images/${this.image}`;
    this.imageUrl = `/products/assets/images/${this.image}`; 
  }

  async save() {
    const productData = {
      title: this.title,
      summary: this.summary,
      description: this.description,
      price: this.price,
      image: this.image,
    };

    if (this.id) {
      const productId = new mongodb.ObjectId(this.id);

      if (!this.image) {
        delete productData.image; //deletes key-value pair from productData object
      }

      await db.getDb()
        .collection("products")
        .updateOne({_id: productId}, {$set: productData});
        
    } else {
      await db.getDb()
      .collection("products")
      .insertOne(productData); // save the product to the database
    }
  }
  async replaceImage(newImage) {
    this.image = newImage;
    this.updateImageData();
  }
}

module.exports = Product;
