require("dotenv").config({ quiet: true });
const path = require("path");
const express = require("express");
const createError = require("http-errors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const favicon = require("serve-favicon");
const methodOverride = require("method-override");
const { RedisStore } = require("connect-redis");
const redisClient = require("./db/redis-client");
const app = express();

app.use(morgan('tiny'));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(methodOverride("_method"));
app.use(cookieParser());
app.use(
    session({
        store: new RedisStore({ client: redisClient }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    }),
);
app.use(flash());

app.set("view engine", "pug");

app.use((req, res, next) => {
    // Flash locals
    res.locals.info = req.flash("info") || [];
    res.locals.error = req.flash("error") || [];

    // User locals
    res.locals.userId = req.session.userId || null;
    res.locals.userFirstName = req.session.userFirstName || null;
    res.locals.userLastName = req.session.userLastName || null;
    res.locals.userRole = req.session.userRole || null;
    res.locals.orgId = req.session.orgId || null;
    res.locals.orgName = req.session.orgName || null;

    next();
});

app.get("/", (req, res) => {
    res.render("home", {
        title: "Home"
    });
});

app.use("/", require("./routes"))

// 404 Error.
app.use((req, res, next) => {
    next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
    console.log(err);

    res.status(err.status || 500);
    res.render("error", {
        title: err.status || 500,
        error: req.app.get("env") === "development" ? err : {}
    });
});

// Main
const main = async () => {
    await redisClient.connect().catch(console.error);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Application is up and running at http://localhost:3000`);
    });
};

if (require.main === module) {
    main();
}

module.exports = app;
