const path = require("path");

const express = require("express");
const session = require("express-session");
const mongoDBStore = require("connect-mongodb-session");
const { ObjectId } = require('mongodb');

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
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, //30 days; if no date set, cookie doesn't expire
    },
  })
);

// Middleware to make variables available in views
app.use(async function(req, res, next) {
  //res.locals.isAuthenticated = req.session.isAuthenticated;

  const user = req.session.user;
  const isAuth = req.session.isAuthenticated;

  if (!user || !isAuth) {
    return next(); //start the next middleware
  }

  const userDoc = await db
    .getDb()
    .collection("users")
    .findOne({ _id: new ObjectId(user.id) });
  const isAdmin = userDoc.isAdmin;

  //global variables available in all the templates
  res.locals.isAuth = isAuth;
  res.locals.isAdmin = isAdmin || false;;

  next();
});

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
