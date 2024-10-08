const express = require("express");
const mongodb = require("mongodb");

const router = express.Router();
const Post = require("../models/post");
const Contact = require("../models/contact");
const db = require("../data/database"); //access to database
const ObjectId = mongodb.ObjectId;


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

router.post("/contact", async function (req, res) {
  const enteredName = req.body.name;
  const enteredEmail = req.body.email;
  const enteredSubject = req.body.subject;
  const enteredMessage = req.body.message;

 
  const newContact = new Contact(enteredName, enteredEmail, enteredSubject, enteredMessage);
  await newContact.save();

  res.render("shared/contact");
});

router.post("/posts/:id/delete", async function(req, res){
  const postId = new ObjectId(req.params.id);
  const result = await db.getDb().collection("posts").deleteOne({_id: postId});
  res.redirect("/blog");
});

//GET error pages
router.get("/401", (req, res) => {
  res.status(401).render("401");
});
router.get("/403", (req, res) => {
  res.status(403).render("403");
});
router.get("/500", (req, res) => {
  res.status(500).render("500");
});

module.exports = router;
