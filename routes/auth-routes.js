const express = require("express");
const mongodb = require("mongodb");
const bcrypt = require("bcryptjs");

const db = require("../data/database");

const ObjectId = mongodb.ObjectId;

const router = express.Router();

router.get("/join", (req, res) => {
  let sessionInputData = req.session.inputData;

  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      username: "",
      email: "",
      confirmEmail: "",
      password: "",
      confirmPassword: "",
    };
  }

  //flashing - clear data stored in session, so input doesn't show up all the time
  req.session.inputData = null;

  res.render("shared/join", { inputData: sessionInputData });
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
    //temporarily storing signup data using session
    req.session.inputData = {
      hasError: true,
      message: "Invalid input - please check your data.",
      username: username,
      email: email,
      confirmEmail: confirmEmail,
      password: password,
      confirmPassword: confirmPassword,
    };

    req.session.save(function () {
      res.redirect("/join");
    });
    return; //have to add this return so that the code below doesn't execute
    //in case there is invalid input. If code below executes, server will crash.
  }

  const existingUserCheck = await db
    .getDb()
    .collection("users")
    .findOne({ email: email });

  if (existingUserCheck) {
    req.session.inputData = {
      hasError: true,
      message: "User already exists!",
      username: username,
      email: email,
      confirmEmail: confirmEmail,
      password: password,
      confirmPassword: confirmPassword,
    };
    req.session.save(function () {
      res.redirect("/join");
    });
    return;
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
  let sessionInputData = req.session.inputData;

  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      email: "",
      password: "",
    };
  }

  req.session.inputData = null;
  res.render("shared/login", { inputData: sessionInputData, title: "Login!" });
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
    req.session.inputData = {
      hasError: true,
      message: "Could not log you in - please check your credentials!",
      email: email,
      password: password,
    };
    req.session.save(function () {
      res.redirect("/login");
    });
    return;
  }

  //compare entered password with hashed password
  const passwordsAreEqual = await bcrypt.compare(
    password,
    existingUser.password
  );

  if (!passwordsAreEqual) {
    req.session.inputData = {
      hasError: true,
      message: "Could not log you in - please check your credentials!",
      email: email,
      password: password,
    };

    req.session.save(function () {
      res.redirect("/login");
    });
    return;
  }

  //storing authentication data in session
  req.session.user = {
    id: existingUser._id.toString(),
    email: existingUser.email,
  };
  req.session.isAuthenticated = true;
  req.session.save(function () {
    res.redirect("/mypage"); //will execute only when session data is saved
  });
});

// Protected route
router.get("/mypage", (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.status(401).redirect("/login"); // Redirect to login if not authenticated
  }
  res.render("client/mypage", {
    title: "WelcomeBack!",
    isAuthenticated: req.session.isAuthenticated, // Pass authentication status to view
  });
});

router.get("/admin", async function (req, res) {
  if (!req.session.isAuthenticated) {
    return res.status(401).render("401"); // Typical status code for denied access
  }

  const user = await db
    .getDb()
    .collection("users")
    .findOne({ _id: ObjectId.createFromHexString(req.session.user.id) });

  if (!user || !user.isAdmin) {
    return res.status(403).render("403");
  }

  res.render("admin/admin-page", {
    title: "Admin area!",
    isAuthenticated: req.session.isAuthenticated, // Pass authentication status to view
  });
});

router.post("/logout", (req, res) => {
  req.session.user = null; //clearing user data in session
  req.session.isAuthenticated = false;
  res.redirect("/");
});

module.exports = router;
