const usersService = require("../services/usersService");

module.exports = {
  index: async (req, res, next) => {
    const search = req.query.search || null;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
      const optionsObj = { search, limit, skip };
      const users = await usersService.find(optionsObj);
      const { count } = await usersService.count(optionsObj);

      const pages = Math.ceil(count / limit);

      const pagination = {
        first:
          page > 1
            ? search
              ? `/users?search=${search}&page=1&limit=${limit}`
              : `/users?page=1&limit=${limit}`
            : null,

        prev:
          page > 1
            ? search
              ? `/users?search=${search}&page=${page - 1}&limit=${limit}`
              : `/users?page=${page - 1}&limit=${limit}`
            : null,

        next:
          page < pages
            ? search
              ? `/users?search=${search}&page=${page + 1}&limit=${limit}`
              : `/users?page=${page + 1}&limit=${limit}`
            : null,

        last:
          page < pages
            ? search
              ? `/users?search=${search}&page=${pages}&limit=${limit}`
              : `/users?page=${pages}&limit=${limit}`
            : null,
      };

      return res.render("users/index", {
        title: "Users",
        users,
        pagination,
        search,
        count,
      });
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

  show: async (req, res, next) => {
    const id = req.params.id;

    try {
      const user = await usersService.findOne(id);

      return res.render("users/show", { title: user.email, user });
    } catch (err) {
      next(err);
    }
  },

  edit: async (req, res, next) => {
    const id = req.params.id;

    try {
      const user = await usersService.findOne(id);

      return res.render("users/edit", { title: "Edit user", user });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    const id = req.params.id;
    const { email, password } = req.body;

    if (!email) {
      req.flash("error", "Email is required.");
      res.redirect(`/users/${id}/edit`);
      return;
    }

    if (!password) {
      req.flash("error", "Password is required.");
      res.redirect(`/users/${id}/edit`);
      return;
    }

    try {
      const userObj = { id, email, password };
      const user = await usersService.update(userObj);

      if (!user) {
        req.flash("error", "Problem while updating user.");
        res.redirect(`/users/${id}`);
        return;
      }

      req.flash("info", "User is update.");
      res.redirect(`/users/${id}`);
      return;
    } catch (err) {
      next(err);
    }
  },
};
