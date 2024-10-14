const bcrypt = require("bcrypt");
const authService = require("../services/auth-service");
const companyFieldsController = require("../controllers/admin/company-fields-controller");
const contactFieldsController = require("../controllers/admin/contact-fields-controller");
const dealFieldsController = require("../controllers/admin/deal-fields-controller");
const quoteFieldsController = require("../controllers/admin/quote-fields-controller");
const ticketFieldsController = require("../controllers/admin/ticket-fields-controller");
const taskFieldsController = require("../controllers/admin/task-fields-controller");

module.exports = {
  showLogin: (req, res, next) => {
    res.render("auth/login", { title: "Login" });
  },

  login: async (req, res, next) => {
    const { email, password } = req.body;

    if (!email) {
      req.flash("error", "Email is required.");
      res.redirect("/auth/login");
      return;
    }

    if (!password) {
      req.flash("error", "Password is required.");
      res.redirect("/auth/login");
      return;
    }

    try {
      const loginObj = { email };
      const user = await authService.login(loginObj);

      if (!user) {
        req.flash("error", "Email and/or Password is invalid.");
        res.redirect("/auth/login");
        return;
      }

      if (!bcrypt.compareSync(password, user.password)) {
        req.flash("error", "Email and/or Password is invalid.");
        res.redirect("/auth/login");
        return;
      }

      if (!user.isActive) {
        req.flash(
          "error",
          "User is de-activated. Please contact administrator.",
        );
        res.redirect("/auth/login");
        return;
      }

      req.session.currentUser = {
        id: user.id,
        email: user.email,
        type: user.type,
      };

      if (user.isRequiredToChangePassword) {
        req.flash("info", "Please change the password.");
        res.redirect("/auth/reset");
        return;
      }

      /**
       * Fields
       */
      await companyFieldsController.addCompanyFieldsInSession(req);
      await contactFieldsController.addContactFieldsInSession(req);
      await dealFieldsController.addDealFieldsInSession(req);
      await quoteFieldsController.addQuoteFieldsInSession(req);
      await ticketFieldsController.addTicketFieldsInSession(req);
      await taskFieldsController.addTaskFieldsInSession(req);

      res.redirect("/");
      return;
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
      res.redirect("/auth/register");
      return;
    }

    if (!password) {
      req.flash("error", "Password is required.");
      res.redirect("/auth/register");
      return;
    }

    // Hashing
    const salt = bcrypt.genSaltSync();
    const passwordHash = bcrypt.hashSync(password, salt);

    try {
      const registerObj = { email, password: passwordHash };
      const user = await authService.register(registerObj);

      if (!user) {
        req.flash("error", "Problem while creating an user.");
        res.redirect("/auth/register");
        return;
      }

      req.flash("info", "User is created.");
      res.redirect("/auth/login");
      return;
    } catch (err) {
      next(err);
    }
  },

  logout: (req, res, next) => {
    req.session.destroy((err) => {
      if (err) {
        next(err);
      }
      res.redirect("/");
      return;
    });
  },

  showReset: (req, res, next) => {
    res.render("auth/reset", { title: "Reset password" });
  },

  reset: async (req, res, next) => {
    const { password } = req.body;

    if (!password) {
      req.flash("error", "Password is required.");
      res.redirect("/auth/reset");
      return;
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
      res.redirect("/auth/login");
      return;
    } catch (err) {
      next(err);
    }
  },
};
