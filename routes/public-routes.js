const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const Post = require("../models/post");
const db = require("../data/database");//access to database

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

router.get("/blog", async function (req, res) {
  const posts = await db.getDb().collection("posts").find().toArray();//fetching posts data
  res.render("shared/blog", { title: "Some Deep 3D Thoughts.", posts: posts });//in {} data passed to template
});

router.post("/admin", async function (req, res) {
  const enteredTitle = req.body.title;
  const enteredContent = req.body.content;

  if (
    !enteredTitle ||
    !enteredContent ||
    enteredTitle.trim() === "" ||
    enteredContent.trim() === ""
  ) {
    req.session.inputData = {
      hasError: true,
      message: "Invalid input - please check your data.",
      title: enteredTitle,
      content: enteredContent,
    };
    res.redirect("/admin");
    return;
  }

  const newPost = new Post(enteredTitle, enteredContent);
  await newPost.save();

  res.redirect("/admin");
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
