const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(morgan("tiny"));

app.get("/", (req, res) => {
  res.send("Application is up and running.");
});

app.listen(3000, () => {
  console.log("Application is up and running at http://localhost:3000.");
});
