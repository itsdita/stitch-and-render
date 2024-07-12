const express = require("express");
const mongodb = require("mongodb");
const bcrypt = require("bcryptjs");

const db = require("../data/database");

const ObjectId = mongodb.ObjectId;

const router = express.Router();

router.get("/", (req, res) => {
  res.render("shared/landing-page", { title: "Become PRO in CLO!" });
});

router.get("/contact", (req, res) => {
  res.render("shared/contact", { title: "Get in touch!" });
});

router.get("/500", (req, res) => {
  res.render("500", { title: "500error" });
});

module.exports = router;
