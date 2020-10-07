var express = require("express");
var bodyParser = require("body-parser");
var app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: false,
}));
app.use(require("./controllers/home"));
app.use(require("./controllers/users"));
app.listen(5000);
