const bcrypt = require("bcrypt");
const authService = require("../services/auth-service");
const companyLabelsService = require("../services/admin/company-labels-service");
const contactLabelsService = require("../services/admin/contact-labels-service");
const dealLabelsService = require("../services/admin/deal-labels-service");
const quoteLabelsService = require("../services/admin/quote-labels-service");
const ticketLabelsService = require("../services/admin/ticket-labels-service");
const taskLabelsService = require("../services/admin/task-labels-service");

const transformLabels = (labels) => {
  return labels.reduce((acc, { name, displayName }) => {
    acc[name] = displayName;
    return acc;
  }, {});
};

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
