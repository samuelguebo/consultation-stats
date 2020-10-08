const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(require("./controllers/home"));
app.use(require("./controllers/users"));
app.listen(PORT, () => console.log(`Server running on port: ${PORT}.`));
