var express = require('express');
var mysql = require('mysql');
var settings = require('../settings');
var router = express.Router();
var con = mysql.createConnection({
    host: settings.host,
    user: settings.user,
    password: settings.password,
    database: settings.database
});
router.get('/users/:wiki/:pageId', function (req, res) {
    con.connect(function (err) {
        if (err)
            throw err;
        con.query("SELECT * FROM offer", function (err, result, fields) {
            if (err)
                throw err;
            res.send(result);
        });
    });
});
module.exports = router;
