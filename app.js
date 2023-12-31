//jshint esversion: 6

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
require("dotenv").config();

// const mailchimp = require("@mailchimp/mailchimp_marketing");

// mailchimp.setConfig({
//   apiKey: process.env.KEY,
//   server: "us12",
// });

// use bodyParser in app
app.use(bodyParser.urlencoded({ extended: true }));

// to use static img, css into server, public relative url, make folder: public>css + images
app.use(express.static("public"));

// add dynamic port from heroku or 3000
app.listen(process.env.PORT || 3000, function () {
  console.log("server running at port 3000");
});

// send the html to local server
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

// post the value, adding url http.request, adding data structure object from mailchimp,
app.post("/", function (req, res) {
  const name = req.body.nameSub;
  const email = req.body.email;

  // us12 comes from API key, changed the ${}
  const url = "https://us12.api.mailchimp.com/3.0/lists/7201a4dab7";

  const authenticate = `stephen:${process.env.KEY}`;

  // adding options for our http request > method:POST, authenticaion: any name:api key
  const options = {
    method: "POST",
    auth: authenticate,
  };
  console.log(authenticate);
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: name,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  // creating request variable, adding http.request,
  const request = https.request(url, options, function (response) {
    // adding error message, res from app.post
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
      console.log("Subscribed");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    // adding response.on to received data
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  // write the date to mailchimp server
  request.write(jsonData);

  // sepcifiy were done with writing
  request.end();
});

// html form action will call route > adding for failure route, using redirect method, woill trigger app.get (above code)
app.post("/failure", function (req, res) {
  res.redirect("/");
});
