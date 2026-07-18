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

        const relation = await sql`
            SELECT
                "orgId",
                "userId",
                "role"
            FROM
                "orgUsers"
            WHERE
                "userId" = ${user.id} and
                life = 1
        `.then(([x]) => x);

        if (!relation) {
            req.flash("error", "Unable to login. Contact admin.");
            return res.redirect("/auth/login");
        }

        const org = await sql`
            SELECT
                id,
                name,
                description
            FROM
                orgs
            WHERE
                "id" = ${relation.orgId} and
                life = 1
        `.then(([x]) => x);

        if (!org) {
            req.flash("error", "Unable to login. Contact admin.");
            return res.redirect("/auth/login");
        }

        const orgLand = await sql`
            SELECT
                permission
            FROM
                "orgLand"
            WHERE
                "orgId" = ${org.id} and
                life = 1
        `.then(([x]) => x);

        const userLand = await sql`
            SELECT
                permission
            FROM
                "userLand"
            WHERE
                "orgId" = ${org.id} and
                "userId" = ${user.id} and
                life = 1
        `.then(([x]) => x);

        req.session.userId = user.id;
        req.session.userFirstName = user.firstName;
        req.session.userLastName = user.lastName;
        req.session.userRole = relation.role;
        req.session.userPermission = userLand.permission;
        req.session.orgId = org.id;
        req.session.orgName = org.name;
        req.session.orgPermission = orgLand.permission;

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
        await sql.begin(async (tx) => {
            // TODO: Make it correct.
            const user = await tx`
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

            // TODO: Make it correct.
            const org = await tx`
                INSERT INTO orgs (
                    "name",
                    "description"
                ) VALUES (
                    'Beautiful, Inc.',
                    'Welcome to the Beautiful house!'
                ) returning id;
            `.then(([x]) => x);

            // TODO: Make it correct.
            await tx`
                INSERT INTO "orgLand" (
                    "orgId",
                    permission
                ) VALUES (
                    ${org.id},
                    '{
                        "companies": {
                            "enable": true,
                            "read": true,
                            "create": true,
                            "update": true,
                            "delete": true
                        },

                        "contacts": {
                            "enable": true,
                            "read": true,
                            "create": true,
                            "update": true,
                            "delete": true
                        },

                        "deals": {
                            "enable": true,
                            "read": true,
                            "create": true,
                            "update": true,
                            "delete": true
                        },

                        "quotes": {
                            "enable": true,
                            "read": true,
                            "create": true,
                            "update": true,
                            "delete": true
                        },

                        "tickets": {
                            "enable": true,
                            "read": true,
                            "create": true,
                            "update": true,
                            "delete": true
                        },

                        "tasks": {
                            "enable": true,
                            "read": true,
                            "create": true,
                            "update": true,
                            "delete": true
                        },

                        "reports": {
                            "enable": true
                        }
                    }'::jsonb
                )`;

            // TODO: Make it correct.
            await tx`
                INSERT INTO "userLand" (
                    "orgId",
                    "userId",
                    permission
                ) VALUES (
                    ${org.id},
                    ${user.id},
                    '{
                        "companies": {
                            "enable": true,
                            "read": true,
                            "create": true,
                            "update": true,
                            "delete": true
                        },

                        "contacts": {
                            "enable": true,
                            "read": true,
                            "create": true,
                            "update": true,
                            "delete": true
                        },

                        "deals": {
                            "enable": true,
                            "read": true,
                            "create": true,
                            "update": true,
                            "delete": true
                        },

                        "quotes": {
                            "enable": true,
                            "read": true,
                            "create": true,
                            "update": true,
                            "delete": true
                        },

                        "tickets": {
                            "enable": true,
                            "read": true,
                            "create": true,
                            "update": true,
                            "delete": true
                        },

                        "tasks": {
                            "enable": true,
                            "read": true,
                            "create": true,
                            "update": true,
                            "delete": true
                        },

                        "reports": {
                            "enable": true
                        }
                    }'::jsonb
                )`;

            // TODO: Make it correct.
            await tx`
                INSERT INTO "orgUsers" (
                    "orgId",
                    "userId",
                    "role"
                ) VALUES (
                    ${org.id},
                    ${user.id},
                    2
                ) returning id;
            `.then(([x]) => x);
        });

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