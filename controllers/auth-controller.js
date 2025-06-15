const crypto = require("crypto");
const bcrypt = require("bcrypt");
const authService = require("../services/auth-service");
const labelsService = require("../services/admin/labels-service");
const modulesService = require("../services/admin/modules-service");

// const { Resend } = require("resend");
// const resend = new Resend(process.env.RESEND_API_KEY);

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
             * Module
             */
            req.session.modules = {};
            const modules = await modulesService.find(true);
            for (const module of modules) {
                req.session.modules[module.name] = true;
            }

            req.session.labels = {
                company: {},
                contact: {},
                deal: {},
                quote: {},
                ticket: {},
                task: {},
                module: {},
            };
            const columns = ["name", "label", "module"];
            const labels = await labelsService.pluck(columns);

            for (const label of labels) {
                if (req.session.modules.company && label.module === "company") {
                    req.session.labels.company[label.name] = label.label;
                }
                if (req.session.modules.contact && label.module === "contact") {
                    req.session.labels.contact[label.name] = label.label;
                }
                if (req.session.modules.deal && label.module === "deal") {
                    req.session.labels.deal[label.name] = label.label;
                }
                if (req.session.modules.quote && label.module === "quote") {
                    req.session.labels.quote[label.name] = label.label;
                }
                if (req.session.modules.ticket && label.module === "ticket") {
                    req.session.labels.ticket[label.name] = label.label;
                }
                if (req.session.modules.task && label.module === "task") {
                    req.session.labels.task[label.name] = label.label;
                }
                if (label.module === "module") {
                    req.session.labels.module[label.name] = label.label;
                }
            }

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

            // const { data, error } = await resend.emails.send({
            //     from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
            //     to: email,
            //     subject: "Welcome to our application!",
            //     html: `<p>Hi there,</p><p>Thank you for registering. Your account has been created successfully.</p>`,
            // });

            // if (error) {
            //     return console.error(error);
            // }
            // console.log(data);

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

    showForgotPassword: (req, res, next) => {
        res.render("auth/forgot-password", { title: "Forgot password" });
    },

    forgotPassword: async (req, res, next) => {
        const email = req.body.email;

        if (!email) {
            req.flash("error", "Email is required.");
            return res.redirect("/auth/forgot-password");
        }

        try {
            const user = await authService.findUserByEmail(email);

            if (!user) {
                req.flash("error", "Email is invalid.");
                return res.redirect("/auth/forgot-password");
            }

            if (!user.isActive) {
                req.flash(
                    "error",
                    "User is de-activated. Please contact administrator."
                );
                return res.redirect("/auth/forgot-password");
            }

            const token = crypto.randomBytes(32).toString("hex");

            // const resetLink = `http://localhost:3000/auth/reset-password/${token}`;
            // const resetObj = {
            //     email,
            //     token,
            //     expiresIn: new Date(Date.now() + 3600000).toISOString(), // 1 hour
            // };

            // await authService.updateResetToken(resetObj);

            // const { data, error } = await resend.emails.send({
            //     from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
            //     to: email,
            //     subject: "Reset Password",
            //     html: `<p>Hi there,</p><p>Click the link below to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
            // });
            // if (error) {
            //     return console.error(error);
            // }
            // console.log(data);

            req.flash("info", "Reset password link sent to your email.");
            return res.redirect("/auth/login");
        } catch (error) {
            next(error);
        }
    },

    showResetPassword: (req, res, next) => {
        const token = req.params.id;

        res.render("auth/reset-password", { title: "Reset password", token });
    },

    resetPassword: async (req, res, next) => {
        const { password, confirmPassword, token } = req.body;

        if (!password) {
            req.flash("error", "New password is required.");
            return res.redirect(`/auth/reset-password/${token}`);
        }

        if (!confirmPassword) {
            req.flash("error", "Confirm password is required.");
            return res.redirect(`/auth/reset-password/${token}`);
        }

        if (password !== confirmPassword) {
            req.flash("error", "Password and Confirm password must be same.");
            return res.redirect(`/auth/reset-password/${token}`);
        }

        // Hashing
        const salt = bcrypt.genSaltSync();
        const passwordHash = bcrypt.hashSync(password, salt);

        try {
            const resetObj = {
                token,
                password: passwordHash,
            };
            await authService.resetPassword(resetObj);

            req.flash("info", "Password is updated.");
            return res.redirect("/auth/password-reset-success");
        } catch (err) {
            next(err);
        }
    },

    showPasswordResetSuccess: async (req, res, next) => {
        res.render("auth/password-reset-success", {
            title: "Password Reset Successful",
        });
    },
};
