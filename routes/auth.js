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
        req.flash("error", "Email and/or password required.");
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
                password = ${password} and
                life = 1
        `.then(([x]) => x);

        if (!user) {
            req.flash("error", "Incorrect email and/or password.");
            return res.redirect("/auth/login");
        }

        req.session.userId = user.id;

        res.redirect("/dashboard");
    } catch (err) {
        next(err);
    }
});

router.get("/register", (req, res) => {
    return res.render("auth/register", {
        title: "Register"
    })
});

router.post("/register", async (req, res, next) => {
    const { firstName, lastName, email, password, repeatPassword } = req.body;

    if (!firstName || !lastName || !email || !password) {
        req.flash("error", "All fields are required.");
        return res.redirect("/auth/register");
    }

    if (password.length < 6) {
        req.flash("error", "Password needs to be at least 6 characters long.");
        return res.redirect("/auth/register");
    }

    if (password !== repeatPassword) {
        req.flash("error", "Entered password don't match.");
        return res.redirect("/auth/register");
    }

    try {
        const user = await sql`
            INSERT INTO users (
                "firstName",
                "lastName",
                "email",
                "password"
            ) VALUES (
                ${firstName},
                ${lastName},
                ${email},
                ${password}
            ) returning id; 
        `.then(([x]) => x);

        if (!user) {
            req.flash("error", "Unable to create account. Contact admin.");
            return res.redirect("/auth/login");
        }

        req.flash("info", "User created. Continue with login.");
        return res.redirect("/auth/login");
    } catch (err) {
        next(err);
    }
});

router.get('/logout', (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            next(err);
        }

        return res.redirect("/");
    })
});

module.exports = router;