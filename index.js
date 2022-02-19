import express, { json } from "express";
import { join } from "path";
import { stat } from "fs";
import { MongoClient } from "mongodb";

var app = express();
let db;

const port = process.env.PORT || 3000;
app.listen(port);

app.use(json());

MongoClient.connect(
  "mongodb+srv://ASDF:ASDF@cluster0.2a6e0.mongodb.net/CW",
  (err, client) => {
    db = client.db("webstore");
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
    console.log(req.collection)
  });
});

app.use(function (req, res, next) {
  console.log("Request IP: " + req.url);
  console.log("Request date: " + new Date());
  next();
});

app.use(function (req, res, next) {
  var filePath = join(__dirname, "static", req.url);
  stat(filePath, function (err, fileInfo) {
    if (err) {
      next();
      return;
    }
    if (fileInfo.isFile()) {
      res.sendFile(filePath);
    } else {
      next();
    }
  });
});

app.use(function (req, res) {
  res.status(404);
  res.send("File not found!");
});
