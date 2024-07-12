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
  const existingUserCheck = await db
    .getDb()
    .collection("users")
    .findOne({ email: email });

  if (!existingUserCheck) {
    console.log("Could not log in!");
    return res.redirect("/login");
  }

  //compare entered password with hashed password
  const passwordsAreEqual = await bcrypt.compare(
    password,
    existingUserCheck.password
  );

  if (!passwordsAreEqual) {
    console.log("Could not log in - paswords don't match!");
    return res.redirect("/login");
  }

  console.log("User is authenticated");
  res.redirect("/mypage");
});

router.get("/mypage", (req, res) => {
  res.render("client/mypage", { title: "WelcomeBack!" });
});
router.get("/admin", (req, res) => {
    res.render("admin/admin-page", { title: "Admin area!" });
  });

module.exports = router;
