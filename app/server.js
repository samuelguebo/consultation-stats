const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = parseInt(process.env.PORT, 10) || 5000;
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(require("./controllers/home"));
app.use(require("./controllers/users"));
app.listen(port);
