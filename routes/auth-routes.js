const express = require("express");

const authController = require("../controllers/auth-controller");

const router = express.Router();

router.get("/join", authController.getSignup);

router.post("/join", authController.signup);

router.get("/login", authController.getLogin);

router.post("/login", authController.login);

router.post("/logout", authController.logout);

// Protected route
router.get("/mypage", (req, res) => {
  if (!res.locals.isAuth || res.locals.isAdmin) {
    return res.status(401).render("401"); // Redirect to login if not authenticated
  }
  res.render("client/mypage");
});

router.get("/admin", async function (req, res) {
  if (!res.locals.isAuth) {
    return res.status(401).render("401"); // Typical status code for denied access
  }

  if (!res.locals.isAdmin) {
    return res.status(403).render("403");
  }

  res.render("admin/admin-page");
});

module.exports = router;
