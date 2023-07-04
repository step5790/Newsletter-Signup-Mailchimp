//jshint esversion: 6

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");

// use bodyParser in app
app.use(bodyParser.urlencoded({ extended: true }));

// to use static img, css into server, public relative url, make folder: public>css + images
app.use(express.static("public"));

app.listen(3000, function () {
  console.log("servcer running");
});

// send the html to local server
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

// post the value
app.post("/", function (req, res) {
  var name = req.body.nameSub;
  var email = req.body.email;
  console.log(name, email);
});
