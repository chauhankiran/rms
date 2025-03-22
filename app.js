const path = require("path");
const express = require("express");
const morgan = require("morgan");
const favicon = require("serve-favicon");
const app = express();

app.set("view engine", "pug");

app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

app.get("/", (req, res) => {
    res.send("Application is up and running.");
});

// companies.
app.get("/companies", (req, res) => {
    res.render("companies/index", {
        title: "Index",
    });
});
app.get("/companies/new", (req, res) => {
    res.render("companies/new", {
        title: "New",
    });
});
app.post("/companies", (req, res) => {});
app.get("/companies/:id", (req, res) => {
    res.render("companies/show", {
        title: "Show",
    });
});
app.get("/companies/:id/edit", (req, res) => {
    res.render("companies/edit", {
        title: "Edit",
    });
});
app.put("/companies/:id", (req, res) => {});
app.patch("/companies/:id", (req, res) => {});
app.delete("/companies/:id", (req, res) => {});

// 404
app.all("*", (req, res, next) => {
    res.render("errors/404");
});

app.listen(3000, () => {
    console.log("Application is up and running at http://localhost:3000.");
});
