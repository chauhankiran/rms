const express = require("express");
const sql = require("../db/sql");
const router = express.Router();

router.get("/", (req, res) => {
    return res.render("dashboard", {
        title: "Dashboard"
    })
});

module.exports = router;