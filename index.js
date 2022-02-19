var express = require("express");
var path = require("path");
var fs = require("fs");
var mongodb = require("mongodb").MongoClient;
var app1 = express();
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
app1.listen(port);

MongoClient.connect(
  "mongodb+srv://ASDF:ASDF@cluster0.2a6e0.mongodb.net/CW",
  (err, client) => {
    db = client.db("CW");
  }
);

app1.param("collectionName", (req, res, next, collectionName) => {
  req.collection = db.collection(collectionName);
  return next();
});

app1.get("/", (req, res, next) => {
  res.send("Select a collection");
});

app1.get("/collection/:collectionName", (req, res, next) => {
  req.collection.find({}).toArray((e, results) => {
    if (e) return next(e);
    res.send(results);
  });
});

app1.use(function (req, res, next) {
  console.log("Request IP: " + req.url);
  console.log("Request date: " + new Date());
  next();
});

app1.use(function (req, res, next) {
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

app1.use(function (req, res) {
  res.status(404);
  res.send("File not found!");
});
