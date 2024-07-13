const express = require("express");
const mongodb = require("mongodb");
const bcrypt = require("bcryptjs");

const db = require("../data/database");

const ObjectId = mongodb.ObjectId;

const router = express.Router();


router.get("/join", (req, res) => {
  res.render("shared/join", { title: "Signup!" });
});

router.post("/join", async function (req, res) {
  const userData = req.body;
  const username = userData.username;
  const email = userData.email;
  const confirmEmail = userData["confirm-email"];
  const password = userData.password;
  const confirmPassword = userData["confirm-password"];

  //data validation
  if (
    !username ||
    !email ||
    !confirmEmail ||
    !password ||
    password.trim().length < 6 || //removing blanks/spaces with .trim()
    email !== confirmEmail ||
    password !== confirmPassword ||
    !email.includes("@")
  ) {
    console.log("User input contains invalid data!");
    return res.redirect("/join");
  }

  const existingUserCheck = await db
    .getDb()
    .collection("users")
    .findOne({ email: email });
  
  if (existingUserCheck) {
    console.log("User exists already!");
    return res.redirect("/join");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = {
    username: username,
    email: email,
    password: hashedPassword,
  };

  await db.getDb().collection("users").insertOne(user);

  res.redirect("/login");
});

router.get("/login", (req, res) => {
  res.render("shared/login", { title: "Login!" });
});

router.post("/login", async function (req, res) {
  const userData = req.body;
  const email = userData.email;
  const password = userData.password;

  //check if user exists
  const existingUser = await db
    .getDb()
    .collection("users")
    .findOne({ email: email });

  if (!existingUser) {
    console.log("Could not log in!");
    return res.redirect("/login");
  }

  //compare entered password with hashed password
  const passwordsAreEqual = await bcrypt.compare(
    password,
    existingUser.password
  );

  if (!passwordsAreEqual) {
    console.log("Could not log in - paswords don't match!");
    return res.redirect("/login");
  }

  //storing authentication data in session
  req.session.user = {id: existingUser._id.toString(), email: existingUser.email};
  req.session.isAuthenticated = true;
  req.session.save(function(){
    res.redirect("/mypage"); //will execute only when session data is saved
  });
  
});

// Protected route
router.get("/mypage", (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.status(401).redirect('/login'); // Redirect to login if not authenticated
  }
  res.render("client/mypage", { 
    title: "WelcomeBack!",
    isAuthenticated: req.session.isAuthenticated // Pass authentication status to view
  });
});

router.get("/admin", function (req, res) {
  if (!req.session.isAuthenticated) {
    return res.status(401).render('401'); // Typical status code for denied access
  }
  res.render("admin/admin-page", { 
    title: "Admin area!",
    isAuthenticated: req.session.isAuthenticated // Pass authentication status to view
  });
});

  router.post("/logout", (req, res) => {
    req.session.user = null; //clearing user data in session
    req.session.isAuthenticated = false;
    res.redirect("/");
  });

module.exports = router;
