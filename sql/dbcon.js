var mysql = require("mysql");
var pool = mysql.createPool({
  connectionLimit: 10,
  host: "classmysql.engr.oregonstate.edu",
  user: "cs340_brownmit",
  password: "9892",
  database: "cs340_brownmit",
});
module.exports.pool = pool;
