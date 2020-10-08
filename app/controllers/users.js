const express = require("express");
const mysql = require("mysql");
const settings = require("../settings");
const router = express.Router();

const con = mysql.createConnection({
  host: settings.host,
  user: settings.user,
  password: settings.password,
  database: settings.database,
});

router.get("/users/:wiki/:pageId", function (req, res) {
  con.connect(function (err) {
    if (err) throw err;
    con.query("SELECT * FROM offer", function (err, result, fields) {
      if (err) throw err;
      // console.log(result);
      res.send(result);
    });
  });
  //res.send(req.params)
});

module.exports = router;
