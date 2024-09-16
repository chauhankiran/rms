const path = require("path");
const createError = require("http-errors");
const express = require("express");
const morgan = require("morgan");
const favicon = require("serve-favicon");

const app = express();

// Setup
app.set("view engine", "pug");

// Middleware
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

app.get("/", (req, res, next) => {
  res.render("index");
});

// 404 Error
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.title = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(3000, () => {
  console.log(`Application is up and running at http://localhost:3000`);
});
