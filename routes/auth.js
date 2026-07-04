const express = require("express");
const sql = require("../db/sql");
const router = express.Router();

router.get("/login", (req, res) => {
    return res.render("auth/login", {
        title: "Login"
    })
});

router.post("/login", async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        req.flash("info", "Email and/or password required.");
        return res.redirect("/auth/login");
    }

    try {
        const user = await sql`
            SELECT
                id,
                email,
                password
            FROM
                users
            WHERE
                email = ${email} and
                password = ${password}
        `.then(([x]) => x);

        if (!user) {
            req.flash("error", "Incorrect email and/or password.");
            return res.redirect("/auth/login");
        }

        req.session.userId = user.id;

        res.redirect("/");
    } catch (err) {
        next(err)
    }
})

module.exports = router;