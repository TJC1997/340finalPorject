var express = require("express");
var mysql = require("./dbcon.js");
var app = express();
var bodyParser = require("body-parser");
var cors = require("cors");
app.use(cors()); // Use this after the variable declaration

app.use(bodyParser.urlencoded({ extended: true }));

const port = 2341;

app.use("/", express.static("public"));

app.get("/genres", function (req, res) {
  var sql = "SELECT genreName AS genreName FROM genres";

  mysql.pool.query(sql, function (error, results, fields) {
    if (error) {
      console.log("error");
    }
    if (results.length != 0) {
      res.status(200).send(results);
    } else {
      res.status(404).send("Not found.");
    }
  });
});

app.get("/singers", function (req, res) {
  var sql =
    "SELECT singerName AS singerName, homeCity AS homeCity, homeState AS homeState FROM singers";

  mysql.pool.query(sql, function (error, results, fields) {
    if (error) {
      console.log("error");
    }
    if (results.length != 0) {
      res.status(200).send(results);
    } else {
      res.status(404).send("Not found.");
    }
  });
});

app.get("/albums", function (req, res) {
  var sql =
    "SELECT albumName as albumName, singerName as singerName, albumReleaseDate AS albumReleaseDate FROM albums INNER JOIN singers_albums ON albums.albumID = singers_albums.albumID INNER JOIN singers ON singers_albums.singerID = singers.singerID";

  mysql.pool.query(sql, function (error, results, fields) {
    if (error) {
      console.log("error");
    }
    if (results.length != 0) {
      res.status(200).send(results);
    } else {
      res.status(404).send("Not found.");
    }
  });
});

app.get("/songs", function (req, res) {
  var sql =
    "SELECT songName, singerName, albumName, genreName FROM songs INNER JOIN songs_singers ON songs.songID = songs_singers.songID INNER JOIN singers ON songs_singers.singerID = singers.singerID INNER JOIN albums ON songs.album = albums.albumID INNER JOIN genres ON songs.genre = genres.genreID";

  mysql.pool.query(sql, function (error, results, fields) {
    if (error) {
      console.log("error");
    }
    if (results.length != 0) {
      res.status(200).send(results);
    } else {
      res.status(404).send("Not found.");
    }
  });
});

app.listen(port, function () {
  console.log("Express started on http://localhost:" + port);
});
