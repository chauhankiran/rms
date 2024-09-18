require("dotenv").config();
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const createError = require("http-errors");
const express = require("express");
const morgan = require("morgan");
const favicon = require("serve-favicon");
const RedisStore = require("connect-redis").default;
const redis = require("redis");

const checkAuth = require("./middleware/checkAuth");

const homeRoutes = require("./routes/home");
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");

const app = express();

// Setup
app.set("view engine", "pug");

// Redis
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: +process.env.REDIS_PORT,
});
redisClient.connect().catch(console.error);

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(cookieParser());
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(flash());

// Flash locals
app.use((req, res, next) => {
  res.locals.info = req.flash("info");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.session.currentUser;
  next();
});

// FIXME: Added for flash testing. Once done, remove.
app.post("/submit", (req, res) => {
  req.flash("info", "Your submission was successful.");
  req.flash("error", "There is problem with your submission.");
  res.redirect("/");
});

app.use("/", homeRoutes);
app.use("/auth", authRoutes);
app.use("/users", checkAuth, usersRoutes);

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
