var express = require("express");
var path = require("path");
var fs = require("fs");
var mongodb = require("mongodb").MongoClient;
var app = express();
let db;

let app = new Vue({
  data: {
    sitename: "Lessons",
    lessons:{},
  },
  created: function () {
      fetch("https://coursewrk-2.herokuapp.com/collection/Lessons").then(
        function (response) {
          response.json.then(function (json) {
            app1.lessons = json;
          });
        }
      );
    },
  });

const port = process.env.PORT || 3000;
app.listen(port);

MongoClient.connect(
  "mongodb+srv://ASDF:ASDF@cluster0.2a6e0.mongodb.net/CW",
  (err, client) => {
    db = client.db("CW");
  }
);

app.param("collectionName", (req, res, next, collectionName) => {
  req.collection = db.collection(collectionName);
  return next();
});

app.get("/", (req, res, next) => {
  res.send("Select a collection");
});

app.get("/collection/:collectionName", (req, res, next) => {
  req.collection.find({}).toArray((e, results) => {
    if (e) return next(e);
    res.send(results);
  });
});

app.use(function (req, res, next) {
  console.log("Request IP: " + req.url);
  console.log("Request date: " + new Date());
  next();
});

app.use(function (req, res, next) {
  var filePath = path.join(__dirname, "static", req.url);
  fs.stat(filePath, function (err, fileInfo) {
    if (err) {
      next();
      return;
    }
    if (fileInfo.isFile()) res.sendFile(filePath);
    else next();
  });
});

app.use(function (req, res) {
  res.status(404);
  res.send("File not found!");
});
