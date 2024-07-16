const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

mongoose.connect("mongodb://localhost:27017/stitchAndRender");

//specify the structure of the documents in a collection
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
});

//Contact is the model name, and Mongoose will use this model to interact with the 
//contacts collection in the MongoDB database
//if want custom collection name, have to add it, after contactSchema
const Contact = mongoose.model("Contact", contactSchema, "contactFormData");

router.get("/", (req, res) => {
  res.render("shared/landing-page", { title: "Become PRO in CLO!" });
});

router.get("/contact", (req, res) => {
  res.render("shared/contact", { title: "Get in touch!" });
});

router.post("/contact", async function (req, res) {
  const { name, email, subject, message } = req.body;
  const newContact = new Contact({ name, email, subject, message });

  try {
    await newContact.save();
    res.status(200).send("Form submitted successfully");
  } catch (error) {
    res.status(500).render("500");
  }
});

router.get("/500", (req, res) => {
  res.render("500", { title: "500error" });
});

module.exports = router;
