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

        const fields = await sql`
            SELECT
                name,
                "displayName",
                category
            FROM
                fields
            WHERE
                "orgId" = ${org.id} and
                life = 1
        `;

        req.session.userId = user.id;
        req.session.userFirstName = user.firstName;
        req.session.userLastName = user.lastName;
        req.session.userRole = relation.role;
        req.session.userPermission = userLand.permission;
        req.session.orgId = org.id;
        req.session.orgName = org.name;
        req.session.orgPermission = orgLand.permission;

        req.session.fields = {};
        for (const field of fields) {
            if (!req.session.fields[field.category]) {
                req.session.fields[field.category] = {};
            }

            req.session.fields[field.category][field.name] = field.displayName;
        }

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
            // This creates a new user.
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
            // This creates a new organization.
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
            // This creates fields for the organization.
            await tx`
                INSERT INTO "fields" (
                    "orgId",
                    name,
                    "displayName",
                    category
                ) VALUES (
                    ${org.id},
                    'company',
                    'Company',
                    'system'
                ), (
                    ${org.id},
                    'contact',
                    'Contact',
                    'system'
                ), (
                    ${org.id},
                    'deal',
                    'Deal',
                    'system'
                ), (
                    ${org.id},
                    'quote',
                    'Quote',
                    'system'
                ), (
                    ${org.id},
                    'ticket',
                    'Ticket',
                    'system'
                ), (
                    ${org.id},
                    'task',
                    'Task',
                    'system'
                ), (
                    ${org.id},
                    'report',
                    'Report',
                    'system'
                ),

                (
                    ${org.id},
                    'id',
                    'Id',
                    'companies'
                ), (
                    ${org.id},
                    'name',
                    'Name',
                    'companies'
                ), (
                    ${org.id},
                    'email',
                    'Email',
                    'companies'
                ), (
                    ${org.id},
                    'website',
                    'Website',
                    'companies'
                ), (
                    ${org.id},
                    'phone',
                    'Phone',
                    'companies'
                ), (
                    ${org.id},
                    'mobile',
                    'Mobile',
                    'companies'
                ), (
                    ${org.id},
                    'telephone',
                    'Telephone',
                    'companies'
                ), (
                    ${org.id},
                    'fax',
                    'Fax',
                    'companies'
                ), (
                    ${org.id},
                    'address1',
                    'Address 1',
                    'companies'
                ), (
                    ${org.id},
                    'address2',
                    'Address 2',
                    'companies'
                ), (
                    ${org.id},
                    'city',
                    'City',
                    'companies'
                ), (
                    ${org.id},
                    'zip',
                    'Zip',
                    'companies'
                ), (
                    ${org.id},
                    'stateId',
                    'State',
                    'companies'
                ), (
                    ${org.id},
                    'countryId',
                    'Country',
                    'companies'
                ), (
                    ${org.id},
                    'industryId',
                    'Industry',
                    'companies'
                ), (
                    ${org.id},
                    'revenue',
                    'Revenue',
                    'companies'
                ), (
                    ${org.id},
                    'employeeSize',
                    'Employee size',
                    'companies'
                ), (
                    ${org.id},
                    'sourceId',
                    'Source',
                    'companies'
                ), (
                    ${org.id},
                    'statusId',
                    'Status',
                    'companies'
                ), (
                    ${org.id},
                    'stageId',
                    'Stage',
                    'companies'
                ), (
                    ${org.id},
                    'createdBy',
                    'Created by',
                    'companies'
                ), (
                    ${org.id},
                    'createdAt',
                    'Created at',
                    'companies'
                ), (
                    ${org.id},
                    'updatedBy',
                    'Updated by',
                    'companies'
                ), (
                    ${org.id},
                    'updatedAt',
                    'Updated at',
                    'companies'
                )`;

            // TODO: Make it correct.
            // This creates permissions for the organization.
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
            // This creates permissions for the user.
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
            // This create values for the dropdown fields.
            await tx`
                INSERT INTO "states" (
                    "orgId",
                    name
                ) VALUES (
                    ${org.id},
                    'California'
                ), (
                    ${org.id},
                    'Texas'
                ), (
                    ${org.id},
                    'New York'
                )
            `;
            await tx`
                INSERT INTO "countries" (
                    "orgId",
                    name
                ) VALUES (
                    ${org.id},
                    'India'
                ), (
                    ${org.id},
                    'United States'
                ), (
                    ${org.id},
                    'Canada'
                ), (
                    ${org.id},
                    'Mexico'
                )
            `;
            await tx`
                INSERT INTO "industries" (
                    "orgId",
                    name
                ) VALUES (
                    ${org.id},
                    'Technology'
                ), (
                    ${org.id},
                    'Finance'
                ), (
                    ${org.id},
                    'Healthcare'
                )
            `;
            await tx`
                INSERT INTO "sources" (
                    "orgId",
                    name
                ) VALUES (
                    ${org.id},
                    'Website'
                ), (
                    ${org.id},
                    'Referral'
                ), (
                    ${org.id},
                    'Advertisement'
                )
            `;
            await tx`
                INSERT INTO "statuses" (
                    "orgId",
                    name
                ) VALUES (
                    ${org.id},
                    'New'
                ), (
                    ${org.id},
                    'In Progress'
                ), (
                    ${org.id},
                    'Closed'
                )
            `;
            await tx`
                INSERT INTO "stages" (
                    "orgId",
                    name
                ) VALUES (
                    ${org.id},
                    'Prospecting'
                ), (
                    ${org.id},
                    'Qualification'
                ), (
                    ${org.id},
                    'Proposal'
                ), (
                    ${org.id},
                    'Negotiation'
                ), (
                    ${org.id},
                    'Closed Won'
                ), (
                    ${org.id},
                    'Closed Lost'
                )
            `;

            // TODO: Make it correct.
            // This creates a relation between the organization and the user.
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