const path = require("path");

const express = require("express");
const csrf = require("csurf");
const expressSession = require("express-session");


const bodyParser = require("body-parser");

const db = require("./data/database");
const createSessionConfig = require("./config/session");
const addCsrfTokenMiddleware = require("./middlewares/csrf-token");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const checkAuthStatusMiddleware = require("./middlewares/check-auth");
const protectRoutesMiddleware = require("./middlewares/protect-routes");
const authRoutes = require("./routes/auth-routes");
const publicRoutes = require("./routes/public-routes");
const shopRoutes = require("./routes/shop-routes");
const adminRoutes = require("./routes/admin-routes");

const app = express();

// Activate EJS view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true })); // Parse incoming request bodies
app.use(bodyParser.json());
app.use(express.static("public")); // Serve static files (e.g. CSS files)
app.use("/products/assets", express.static("product-data")); // Serve static files (e.g. images)

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));
app.use(csrf()); //generate csrf tokens
app.use(addCsrfTokenMiddleware);
app.use(checkAuthStatusMiddleware);

app.use(authRoutes);
app.use(publicRoutes);
app.use(shopRoutes);
app.use(protectRoutesMiddleware);
app.use("/admin", adminRoutes);

// server side error-handling middleware
app.use(errorHandlerMiddleware);

db.connectToDatabase()
  .then(function () {
    app.listen(3000);
  })
  .catch(function (error) {
    console.log("Failed to connect to the database!");
    console.log(error);
  });
