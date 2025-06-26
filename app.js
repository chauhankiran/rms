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
const redisClient = require("./db/redis-client");
const methodOverride = require("method-override");
const pluralize = require("pluralize");

const checkAuth = require("./middleware/check-auth");
const checkModule = require("./middleware/check-module");

const homeRoutes = require("./routes/home");
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const companiesRoutes = require("./routes/companies");
const contactsRoutes = require("./routes/contacts");
const dealsRoutes = require("./routes/deals");
const quotesRoutes = require("./routes/quotes");
const ticketsRoutes = require("./routes/tickets");
const tasksRoutes = require("./routes/tasks");
const adminRoutes = require("./routes/admin");

const app = express();

// Helper functions available in pug.
function capitalize(text) {
    return text
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

app.locals.capitalize = capitalize;
app.locals.singular = pluralize.singular;
app.locals.plural = pluralize.plural;
app.locals.downcase = function (text) {
    return text.toLowerCase();
};

// Setup
app.set("view engine", "pug");

// Middleware
app.use(morgan("dev"));
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
    })
);
app.use(flash());

// Flash locals
app.use((req, res, next) => {
    res.locals.info = req.flash("info");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.session.currentUser;
    res.locals.modules = req.session.modules || {};

    res.locals.labels = res.locals.labels || {};
    res.locals.labels.company = req.session.labels?.company;
    res.locals.labels.contact = req.session.labels?.contact;
    res.locals.labels.deal = req.session.labels?.deal;
    res.locals.labels.quote = req.session.labels?.quote;
    res.locals.labels.ticket = req.session.labels?.ticket;
    res.locals.labels.task = req.session.labels?.task;
    res.locals.labels.module = req.session.labels?.module;
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
app.use("/dashboard", checkAuth, dashboardRoutes);
app.use("/companies", checkAuth, checkModule("company"), companiesRoutes);
app.use("/contacts", checkAuth, checkModule("contact"), contactsRoutes);
app.use("/deals", checkAuth, checkModule("deal"), dealsRoutes);
app.use("/quotes", checkAuth, checkModule("quote"), quotesRoutes);
app.use("/tickets", checkAuth, checkModule("ticket"), ticketsRoutes);
app.use("/tasks", checkAuth, checkModule("task"), tasksRoutes);
app.use("/admin", checkAuth, adminRoutes);

// 404 Error
app.use((req, res, next) => {
    // createError() call the default error handler
    // to render the error.pug.
    next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.title = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    console.log(err);

    // render the error page
    res.status(err.status || 500);
    res.render("error");
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
