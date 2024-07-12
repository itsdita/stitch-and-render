const path = require("path");

const express = require("express");
const session = require("express-session");
const mongoDBStore = require("connect-mongodb-session");

const db = require("./data/database");
const authRoutes = require("./routes/auth-routes");
const publicRoutes = require("./routes/public-routes");

const MongoDBStore = mongoDBStore(session);

const app = express();

//set up sessions storage
const sessionStore = new MongoDBStore({
  uri: "mongodb://localhost:27017",
  databaseName: "stitchAndRender",
  collection: "sessions",
});

// Activate EJS view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true })); // Parse incoming request bodies
app.use(express.static("public")); // Serve static files (e.g. CSS files)

app.use(
  session({
    secret: "snr-wbst-1913",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);

app.use(authRoutes);
app.use(publicRoutes);

//request error-handling middleware function
app.use(function (error, req, res, next) {
  console.log(error);
  res.status(500).render("500"); //internal server error, render a view called '500'
});

db.connectToDatabase().then(function () {
  app.listen(3000);
});
