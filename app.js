//jshint esversion: 6

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

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

// post the value, adding url http.request, adding data structure object from mailchimp,
app.post("/", function (req, res) {
  const name = req.body.nameSub;
  const email = req.body.email;
  const url = "https://us12.api.mailchimp.com/3.0/lists/7201a4dab7";

  // adding options > method:POST, authenticaion: any name:api key
  const options = {
    method: "POST",
    auth: "stephen:2c90bf21bde653870f61043e7aaa4e8b",
  };
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

// 7201a4dab7
// 2c90bf21bde653870f61043e7aaa4e8b-us12
