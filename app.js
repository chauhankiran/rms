const express = require("express");
const morgan = require("morgan");

const app = express();

// Setup
app.set("view engine", "pug");

// Middleware
app.use(morgan("short"));

app.get("/", (req, res, next) => {
  res.render("index");
});

app.listen(3000, () => {
  console.log(`Application is up and running at http://localhost:3000`);
});
