const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const apiRoutes = require("./api-routes");
require("dotenv").config();

const app = express();

/* mongoDB connection */
mongoose.connect(process.env.dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var db = mongoose.connection;
db.on("error", () => console.log("MongoDB connection error"));
db.on("open", () => console.log("MongoDB connection is successful"));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.engine(
  "hbs",
  exphbs.engine({
    extname: ".hbs",
  })
);
app.set("view engine", "hbs");
app.use(cookieParser());
app.use(apiRoutes);
app.use(express.static(__dirname + "/public"));

app.all("*", (req, res) => {
  if (req.cookies.user) res.redirect("/home");
  else res.redirect("/login");
});

app.listen(process.env.PORT, () => {
  console.log(`listening @ http://localhost:${process.env.PORT}`);
});
