const bcrypt = require("bcrypt");
const authService = require("../services/auth-service");
const companyLabelsService = require("../services/admin/company-labels-service");
const contactLabelsService = require("../services/admin/contact-labels-service");
const dealLabelsService = require("../services/admin/deal-labels-service");
const quoteLabelsService = require("../services/admin/quote-labels-service");
const ticketLabelsService = require("../services/admin/ticket-labels-service");
const taskLabelsService = require("../services/admin/task-labels-service");
const moduleLabelsService = require("../services/admin/module-labels-service");

const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

const transformLabels = (labels) => {
    return labels.reduce((acc, { name, displayName }) => {
        acc[name] = displayName;
        return acc;
    }, {});
};

module.exports = {
    showLogin: (req, res, next) => {
        return res.render("auth/login", { title: "Login" });
    },

    login: async (req, res, next) => {
        const { email, password } = req.body;

        if (!email) {
            req.flash("error", "Email is required.");
            return res.redirect("/auth/login");
        }

        if (!password) {
            req.flash("error", "Password is required.");
            return res.redirect("/auth/login");
        }

        try {
            const loginObj = { email };
            const user = await authService.login(loginObj);

            if (!user) {
                req.flash("error", "Email and/or Password is invalid.");
                return res.redirect("/auth/login");
            }

            if (!bcrypt.compareSync(password, user.password)) {
                req.flash("error", "Email and/or Password is invalid.");
                return res.redirect("/auth/login");
            }

            if (!user.isActive) {
                req.flash(
                    "error",
                    "User is de-activated. Please contact administrator."
                );
                return res.redirect("/auth/login");
            }

            req.session.currentUser = {
                id: user.id,
                email: user.email,
                type: user.type,
            };

            if (user.isRequiredToChangePassword) {
                req.flash("info", "Please change the password.");
                return res.redirect("/auth/reset");
            }

            /**
             * Fields
             */
            req.session.labels = req.session.labels || {};
            const columns = ["name", "displayName"];

            // Company labels.
            const companyLabels = await companyLabelsService.pluck(columns);
            req.session.labels.company = transformLabels(companyLabels);

            // Contact labels.
            const contactLabels = await contactLabelsService.pluck(columns);
            req.session.labels.contact = transformLabels(contactLabels);

            // Deal labels.
            const dealLabels = await dealLabelsService.pluck(columns);
            req.session.labels.deal = transformLabels(dealLabels);

            // Quote labels.
            const quoteLabels = await quoteLabelsService.pluck(columns);
            req.session.labels.quote = transformLabels(quoteLabels);

            // Ticket labels.
            const ticketLabels = await ticketLabelsService.pluck(columns);
            req.session.labels.ticket = transformLabels(ticketLabels);

            // Task labels.
            const taskLabels = await taskLabelsService.pluck(columns);
            req.session.labels.task = transformLabels(taskLabels);

            // Module labels.
            const moduleLabels = await moduleLabelsService.pluck(columns);
            req.session.labels.module = transformLabels(moduleLabels);

            return res.redirect("/");
        } catch (err) {
            next(err);
        }
    },

    showRegister: (req, res, next) => {
        res.render("auth/register", { title: "Register" });
    },

    register: async (req, res, next) => {
        const { email, password } = req.body;

        if (!email) {
            req.flash("error", "Email is required.");
            return res.redirect("/auth/register");
        }

        if (!password) {
            req.flash("error", "Password is required.");
            return res.redirect("/auth/register");
        }

        // Hashing
        const salt = bcrypt.genSaltSync();
        const passwordHash = bcrypt.hashSync(password, salt);

        try {
            const registerObj = { email, password: passwordHash };
            const user = await authService.register(registerObj);

            if (!user) {
                req.flash("error", "Problem while creating an user.");
                return res.redirect("/auth/register");
            }

            const { data, error } = await resend.emails.send({
                from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
                to: email,
                subject: "Welcome to our application!",
                html: `<p>Hi there,</p><p>Thank you for registering. Your account has been created successfully.</p>`,
            });

            if (error) {
                return console.error(error);
            }
            console.log(data);

            req.flash("info", "User is created.");
            return res.redirect("/auth/login");
        } catch (err) {
            next(err);
        }
    },

    logout: (req, res, next) => {
        req.session.destroy((err) => {
            if (err) {
                next(err);
            }
            return res.redirect("/");
        });
    },

    showReset: (req, res, next) => {
        res.render("auth/reset", { title: "Reset password" });
    },

    reset: async (req, res, next) => {
        const { password } = req.body;

        if (!password) {
            req.flash("error", "Password is required.");
            return res.redirect("/auth/reset");
        }

        // Hashing
        const salt = bcrypt.genSaltSync();
        const passwordHash = bcrypt.hashSync(password, salt);

        try {
            const resetObj = {
                password: passwordHash,
                id: req.session.currentUser.id,
                updatedBy: req.session.currentUser.id,
            };
            await authService.reset(resetObj);

            req.flash("info", "Password is updated.");
            return res.redirect("/auth/login");
        } catch (err) {
            next(err);
        }
    },
};
