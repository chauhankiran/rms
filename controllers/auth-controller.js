const crypto = require("crypto");
const bcrypt = require("bcrypt");
const authService = require("../services/auth-service");
const labelsService = require("../services/admin/labels-service");
const modulesService = require("../services/admin/modules-service");

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
                req.flash("error", "User is de-activated. Please contact administrator.");
                return res.redirect("/auth/login");
            }

            req.session.currentUser = {
                id: user.id,
                email: user.email,
                type: user.type,
            };

            req.session.permission = {
                canAccessCompany: user.canAccessCompany,
                canAccessContact: user.canAccessContact,
                canAccessDeal: user.canAccessDeal,
                canAccessQuote: user.canAccessQuote,
                canAccessTicket: user.canAccessTicket,
                canAccessTask: user.canAccessTask,
                canAccessReport: user.canAccessReport,
                canAccessFile: user.canAccessFile,
                canAccessComment: user.canAccessComment,
                canAccessCommentOnCompany: user.canAccessCommentOnCompany,
                canAccessCommentOnContact: user.canAccessCommentOnContact,
                canAccessCommentOnDeal: user.canAccessCommentOnDeal,
                canAccessCommentOnQuote: user.canAccessCommentOnQuote,
                canAccessCommentOnTicket: user.canAccessCommentOnTicket,
                canAccessCommentOnTask: user.canAccessCommentOnTask,
                canAccessFileOnCompany: user.canAccessFileOnCompany,
                canAccessFileOnContact: user.canAccessFileOnContact,
                canAccessFileOnDeal: user.canAccessFileOnDeal,
                canAccessFileOnQuote: user.canAccessFileOnQuote,
                canAccessFileOnTicket: user.canAccessFileOnTicket,
                canAccessFileOnTask: user.canAccessFileOnTask,
                showContactOnCompany: user.showContactOnCompany,
                showDealOnCompany: user.showDealOnCompany,
                showQuoteOnCompany: user.showQuoteOnCompany,
                showTicketOnCompany: user.showTicketOnCompany,
                showTaskOnCompany: user.showTaskOnCompany,
                showDealOnContact: user.showDealOnContact,
                showQuoteOnContact: user.showQuoteOnContact,
                showTicketOnContact: user.showTicketOnContact,
                showTaskOnContact: user.showTaskOnContact,
                showQuoteOnDeal: user.showQuoteOnDeal,
                showTicketOnDeal: user.showTicketOnDeal,
                showTaskOnDeal: user.showTaskOnDeal,
                showTaskOnQuote: user.showTaskOnQuote,
                showTaskOnTicket: user.showTaskOnTicket,
                canViewCompany: user.canViewCompany,
                canCreateCompany: user.canCreateCompany,
                canEditCompany: user.canEditCompany,
                canArchiveCompany: user.canArchiveCompany,
                canDeleteCompany: user.canDeleteCompany,
                canViewCompanyComment: user.canViewCompanyComment,
                canCreateCompanyComment: user.canCreateCompanyComment,
                canEditCompanyComment: user.canEditCompanyComment,
                canArchiveCompanyComment: user.canArchiveCompanyComment,
                canDeleteCompanyComment: user.canDeleteCompanyComment,
                canViewCompanyFile: user.canViewCompanyFile,
                canCreateCompanyFile: user.canCreateCompanyFile,
                canEditCompanyFile: user.canEditCompanyFile,
                canArchiveCompanyFile: user.canArchiveCompanyFile,
                canDeleteCompanyFile: user.canDeleteCompanyFile,
                canViewContact: user.canViewContact,
                canCreateContact: user.canCreateContact,
                canEditContact: user.canEditContact,
                canArchiveContact: user.canArchiveContact,
                canDeleteContact: user.canDeleteContact,
                canViewContactComment: user.canViewContactComment,
                canCreateContactComment: user.canCreateContactComment,
                canEditContactComment: user.canEditContactComment,
                canArchiveContactComment: user.canArchiveContactComment,
                canDeleteContactComment: user.canDeleteContactComment,
                canViewContactFile: user.canViewContactFile,
                canCreateContactFile: user.canCreateContactFile,
                canEditContactFile: user.canEditContactFile,
                canArchiveContactFile: user.canArchiveContactFile,
                canDeleteContactFile: user.canDeleteContactFile,
                canViewDeal: user.canViewDeal,
                canCreateDeal: user.canCreateDeal,
                canEditDeal: user.canEditDeal,
                canArchiveDeal: user.canArchiveDeal,
                canDeleteDeal: user.canDeleteDeal,
                canViewDealComment: user.canViewDealComment,
                canCreateDealComment: user.canCreateDealComment,
                canEditDealComment: user.canEditDealComment,
                canArchiveDealComment: user.canArchiveDealComment,
                canDeleteDealComment: user.canDeleteDealComment,
                canViewDealFile: user.canViewDealFile,
                canCreateDealFile: user.canCreateDealFile,
                canEditDealFile: user.canEditDealFile,
                canArchiveDealFile: user.canArchiveDealFile,
                canDeleteDealFile: user.canDeleteDealFile,
                canViewQuote: user.canViewQuote,
                canCreateQuote: user.canCreateQuote,
                canEditQuote: user.canEditQuote,
                canArchiveQuote: user.canArchiveQuote,
                canDeleteQuote: user.canDeleteQuote,
                canViewQuoteComment: user.canViewQuoteComment,
                canCreateQuoteComment: user.canCreateQuoteComment,
                canEditQuoteComment: user.canEditQuoteComment,
                canArchiveQuoteComment: user.canArchiveQuoteComment,
                canDeleteQuoteComment: user.canDeleteQuoteComment,
                canViewQuoteFile: user.canViewQuoteFile,
                canCreateQuoteFile: user.canCreateQuoteFile,
                canEditQuoteFile: user.canEditQuoteFile,
                canArchiveQuoteFile: user.canArchiveQuoteFile,
                canDeleteQuoteFile: user.canDeleteQuoteFile,
                canViewTicket: user.canViewTicket,
                canCreateTicket: user.canCreateTicket,
                canEditTicket: user.canEditTicket,
                canArchiveTicket: user.canArchiveTicket,
                canDeleteTicket: user.canDeleteTicket,
                canViewTicketComment: user.canViewTicketComment,
                canCreateTicketComment: user.canCreateTicketComment,
                canEditTicketComment: user.canEditTicketComment,
                canArchiveTicketComment: user.canArchiveTicketComment,
                canDeleteTicketComment: user.canDeleteTicketComment,
                canViewTicketFile: user.canViewTicketFile,
                canCreateTicketFile: user.canCreateTicketFile,
                canEditTicketFile: user.canEditTicketFile,
                canArchiveTicketFile: user.canArchiveTicketFile,
                canDeleteTicketFile: user.canDeleteTicketFile,
                canViewTask: user.canViewTask,
                canCreateTask: user.canCreateTask,
                canEditTask: user.canEditTask,
                canArchiveTask: user.canArchiveTask,
                canDeleteTask: user.canDeleteTask,
                canViewTaskComment: user.canViewTaskComment,
                canCreateTaskComment: user.canCreateTaskComment,
                canEditTaskComment: user.canEditTaskComment,
                canArchiveTaskComment: user.canArchiveTaskComment,
                canDeleteTaskComment: user.canDeleteTaskComment,
                canViewTaskFile: user.canViewTaskFile,
                canCreateTaskFile: user.canCreateTaskFile,
                canEditTaskFile: user.canEditTaskFile,
                canArchiveTaskFile: user.canArchiveTaskFile,
                canDeleteTaskFile: user.canDeleteTaskFile,
            };

            if (user.isRequiredToChangePassword) {
                req.flash("info", "Please change the password.");
                return res.redirect("/auth/reset");
            }

            /**
             * Module
             */
            req.session.modules = req.session.modules || {};
            const modules = await modulesService.find(true);
            for (const module of modules) {
                req.session.modules[module.name] = true;
            }

            /**
             * Fields
             */
            req.session.labels = req.session.labels || {};
            const columns = ["name", "displayName"];

            // Company labels.
            const companyLabels = await labelsService.pluck("companyLabels", columns);
            req.session.labels.company = transformLabels(companyLabels);

            // Contact labels.
            const contactLabels = await labelsService.pluck("contactLabels", columns);
            req.session.labels.contact = transformLabels(contactLabels);

            // Deal labels.
            const dealLabels = await labelsService.pluck("dealLabels", columns);
            req.session.labels.deal = transformLabels(dealLabels);

            // Quote labels.
            const quoteLabels = await labelsService.pluck("quoteLabels", columns);
            req.session.labels.quote = transformLabels(quoteLabels);

            // Ticket labels.
            const ticketLabels = await labelsService.pluck("ticketLabels", columns);
            req.session.labels.ticket = transformLabels(ticketLabels);

            // Task labels.
            const taskLabels = await labelsService.pluck("taskLabels", columns);
            req.session.labels.task = transformLabels(taskLabels);

            // Module labels.
            const moduleLabels = await labelsService.pluck("moduleLabels", columns);
            req.session.labels.module = transformLabels(moduleLabels);

            return res.redirect("/dashboard");
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
                req.flash("error", "User is de-activated. Please contact administrator.");
                return res.redirect("/auth/forgot-password");
            }

            const token = crypto.randomBytes(32).toString("hex");

            const resetLink = `http://localhost:3000/auth/reset-password/${token}`;
            const resetObj = {
                email,
                token,
                expiresIn: new Date(Date.now() + 3600000).toISOString(), // 1 hour
            };

            await authService.updateResetToken(resetObj);

            const { data, error } = await resend.emails.send({
                from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
                to: email,
                subject: "Reset Password",
                html: `<p>Hi there,</p><p>Click the link below to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
            });
            if (error) {
                return console.error(error);
            }
            console.log(data);

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
