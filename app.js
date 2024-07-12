const path = require("path");

const express = require("express");

const authRoutes = require('./routes/auth-routes');
const db = require('./data/database');

const app = express();

// Activate EJS view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true })); // Parse incoming request bodies
app.use(express.static("public")); // Serve static files (e.g. CSS files)

app.use(authRoutes);

//request error-handling middleware function
app.use(function(error, req,res, next){
  console.log(error);
  res.status(500).render('500'); //internal server error, render a view called '500'
});

db.connectToDatabase().then(function () {
  app.listen(3000);
});
