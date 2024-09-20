const usersService = require("../services/usersService");

module.exports = {
  index: async (req, res, next) => {
    try {
      const users = await usersService.find();

      return res.render("users/index", { title: "Users", users });
    } catch (err) {
      next(err);
    }
  },

  new: async (req, res, next) => {
    return res.render("users/new", { title: "New user" });
  },

  create: async (req, res, next) => {
    const { email, password } = req.body;

    if (!email) {
      req.flash("error", "Email is required.");
      res.redirect("/users/new");
      return;
    }

    if (!password) {
      req.flash("error", "Password is required.");
      res.redirect("/users/new");
      return;
    }

    try {
      const userObj = { email, password };
      const user = await usersService.create(userObj);

      if (!user) {
        req.flash("error", "Problem while creating an account.");
        res.redirect("/users/new");
        return;
      }

      req.flash("info", "Account is created.");
      res.redirect("/users");
      return;
    } catch (err) {
      next(err);
    }
  },
};
