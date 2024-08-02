const User = require("../models/user.model");
const authUtil = require("../util/authentication");
const userDetailsAreValid = require("../util/validation");
const sessionFlash = require("../util/session-flash");
const session = require("express-session");

function getSignup(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email: "",
      password: "",
      confirmEmail: "",
      confirmPassword: "",
      username: "",
    };
  }
  res.render("shared/join", { inputData: sessionData });
}

async function signup(req, res, next) {
  const enteredData = {
    email: req.body.email,
    password: req.body.password,
    confirmEmail: req.body.confirmEmail,
    confirmPassword: req.body.confirmPassword,
    username: req.body.username,
  };

  console.log(enteredData);

  if (
    !userDetailsAreValid(
      req.body.email,
      req.body.password,
      req.body.confirmEmail,
      req.body.confirmPassword,
      req.body.username
    )
  ) {
    sessionFlash.flashDataToSession(
      req,
      {
        hasError: true,
        message: "Invalid input - please check your data.",
        ...enteredData, //spread operator to pass all entered data to object
      },
      function () {
        res.redirect("/join");
      }
    );
    return;
  }

  const user = new User(
    req.body.email,
    req.body.password,
    req.body.confirmEmail,
    req.body.confirmPassword,
    req.body.username
  );

  try {
    const existsAlready = await user.existsAlready();

    if (existsAlready) {
      sessionFlash.flashDataToSession(
        req,
        {
          hasError: true,
          message: "User already exists.",
          ...enteredData,
        },
        function () {
          res.redirect("/join");
        }
      );
      return;
    }

    await user.signup();
  } catch (error) {
    next(error); //will render the 500 error middleware
    return;
  }

  res.redirect("/login");
}

function getLogin(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email: "",
      password: "",
    };
  }
  res.render("shared/login", { inputData: sessionData });
}

async function login(req, res) {
  const user = new User(req.body.email, req.body.password);
  let existingUser;

  try {
    existingUser = await user.getUserWithSameEmail();
  } catch (error) {
    next(error); //will render the 500 error middleware
    return;
  }

  const sessionErrorData = {
    hasError: true,
    message: "Invalid credentials - please check your email and password.",
    email: user.email,
    password: user.password,
  };

  if (!existingUser) {
    sessionFlash.flashDataToSession(req, { sessionErrorData }, function () {
      res.redirect("/login");
    });
    return;
  }

  const passwordIsCorrect = await user.hasMatchingPassword(
    existingUser.password
  );

  if (!passwordIsCorrect) {
    sessionFlash.flashDataToSession(req, { sessionErrorData }, function () {
      res.redirect("/login");
    });
    return;
  }

  //redirect after saving session data
  authUtil.createUserSession(req, existingUser, function () {
    res.redirect("/");
  });
}

function logout(req, res) {
  authUtil.destroyUserAuthSession(req);
  res.redirect("/");
}

module.exports = {
  getSignup: getSignup,
  signup: signup,
  getLogin: getLogin,
  login: login,
  logout: logout,
};
