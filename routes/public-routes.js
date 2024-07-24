const express = require("express");
const mongoose = require("mongoose");
const mongodb = require("mongodb");

const router = express.Router();
const Post = require("../models/post");
const db = require("../data/database"); //access to database
const ObjectId = mongodb.ObjectId;

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
  res.render("shared/landing-page");
});

router.get("/about", (req, res) => {
  res.render("shared/about");
});

router.get("/videos", (req, res) => {
  res.render("shared/videos");
});

router.get("/blog", async function (req, res) {
  const posts = await db.getDb().collection("posts").find().toArray(); //fetching posts data
  res.render("shared/blog", { posts: posts }); //in {} data passed to template
});

router.post("/blog", async function (req, res) {
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
    res.redirect("/blog");
    return;
  }

  const newPost = new Post(enteredTitle, enteredContent);
  await newPost.save();

  res.redirect("/blog");
});

router.get("/posts/:id/edit", async function (req, res) {
  const postId = req.params.id;
  const post = await db
    .getDb()
    .collection("posts")
    .findOne({ _id: new ObjectId(postId) }, { title: 1, content: 1 });

  if (!post) {
    return res.status(404).render(404);
  }

  res.render("admin/update-post", { post: post });
});

router.post("/posts/:id/edit", async function (req, res) {
  const postId = new ObjectId(req.params.id);
  await db
    .getDb()
    .collection("posts")
    .updateOne(
      { _id: postId },
      { $set: { title: req.body.title, content: req.body.content } }
    );
  res.redirect("/blog");
});

router.get("/contact", (req, res) => {
  res.render("shared/contact");
});

router.post("/posts/:id/delete", async function(req, res){
  const postId = new ObjectId(req.params.id);
  const result = await db.getDb().collection("posts").deleteOne({_id: postId});
  res.redirect("/blog");
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

//GET error pages
router.get("/401", (req, res) => {
  res.render("401");
});
router.get("/403", (req, res) => {
  res.render("403");
});
router.get("/500", (req, res) => {
  res.render("500");
});

module.exports = router;
