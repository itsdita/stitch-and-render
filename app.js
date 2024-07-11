const express = require("express");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.static("public"));

app.get('/', (req, res) => {
  res.render('shared/landing-page', { title: 'Become PRO in CLO!' });
});

app.get('/contact', (req, res) => {
  res.render('shared/contact', { title: 'Get in touch!' });
});
app.get('/join', (req, res) => {
  res.render('shared/join', { title: 'Signup!' });
});
app.get('/login', (req, res) => {
  res.render('shared/login', { title: 'Login!' });
});

app.listen(3000);