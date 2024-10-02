const authService = require("../services/auth-service");

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
      const loginObj = { email, password };
      const user = await authService.login(loginObj);

      if (!user) {
        req.flash("error", "Email and/or Password is invalid");
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

      req.session.currentUser = user;

      if (user.isRequiredToChangePassword) {
        req.flash("info", "Please change the password.");
        res.redirect("/auth/reset");
        return;
      }

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

    try {
      const registerObj = { email, password };
      const user = await authService.register(registerObj);

      if (!user) {
        req.flash("error", "Problem while creating an account.");
        res.redirect("/auth/register");
        return;
      }

      req.flash("info", "Account is created.");
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

    console.log("req.session.currentUser: ", req.session.currentUser);

    try {
      const resetObj = {
        password,
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
