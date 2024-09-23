const usersService = require("../services/usersService");

module.exports = {
  index: async (req, res, next) => {
    const search = req.query.search || null;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const orderBy = req.query.orderBy || "id";
    const orderDir = req.query.orderDir || "DESC";

    try {
      const optionsObj = { search, limit, skip, orderBy, orderDir };
      const users = await usersService.find(optionsObj);
      const { count } = await usersService.count(optionsObj);

      const pages = Math.ceil(count / limit);

      const pagination = {
        first:
          page > 1
            ? search
              ? `/users?search=${search}&page=1&limit=${limit}${
                  orderBy ? `&orderBy=${orderBy}&orderDir=${orderDir}` : ""
                }`
              : `/users?page=1&limit=${limit}${
                  orderBy ? `&orderBy=${orderBy}&orderDir=${orderDir}` : ""
                }`
            : null,

        prev:
          page > 1
            ? search
              ? `/users?search=${search}&page=${page - 1}&limit=${limit}${
                  orderBy ? `&orderBy=${orderBy}&orderDir=${orderDir}` : ""
                }`
              : `/users?page=${page - 1}&limit=${limit}${
                  orderBy ? `&orderBy=${orderBy}&orderDir=${orderDir}` : ""
                }`
            : null,

        next:
          page < pages
            ? search
              ? `/users?search=${search}&page=${page + 1}&limit=${limit}${
                  orderBy ? `&orderBy=${orderBy}&orderDir=${orderDir}` : ""
                }`
              : `/users?page=${page + 1}&limit=${limit}${
                  orderBy ? `&orderBy=${orderBy}&orderDir=${orderDir}` : ""
                }`
            : null,

        last:
          page < pages
            ? search
              ? `/users?search=${search}&page=${pages}&limit=${limit}${
                  orderBy ? `&orderBy=${orderBy}&orderDir=${orderDir}` : ""
                }`
              : `/users?page=${pages}&limit=${limit}${
                  orderBy ? `&orderBy=${orderBy}&orderDir=${orderDir}` : ""
                }`
            : null,
      };

      return res.render("users/index", {
        title: "Users",
        users,
        pagination,
        search,
        count,
        orderBy,
        orderDir,
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
      const userObj = {
        email,
        password,
        createdBy: req.session.currentUser.id,
      };
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
      const userObj = {
        id,
        email,
        password,
        updatedBy: req.session.currentUser.id,
      };
      const user = await usersService.update(userObj);

      if (!user) {
        req.flash("error", "Problem while updating user.");
        res.redirect(`/users/${id}`);
        return;
      }

      req.flash("info", "User is updated.");
      res.redirect(`/users/${id}`);
      return;
    } catch (err) {
      next(err);
    }
  },

  destroy: async (req, res, next) => {
    const id = req.params.id;

    try {
      const user = await usersService.destroy(id);

      if (!user) {
        req.flash("error", "Problem while deleting user.");
        res.redirect(`/users/${id}`);
        return;
      }

      req.flash("info", "User is deleted.");
      res.redirect("/users");
    } catch (err) {
      next(err);
    }
  },

  archive: async (req, res, next) => {
    const id = req.params.id;

    try {
      const user = await usersService.findOne(id);

      if (!user) {
        req.flash("error", "User not found.");
        res.redirect(`/users`);
        return;
      }

      const userObj = { id, newUserStatus: !user.isActive };
      await usersService.archive(userObj);

      req.flash("info", "User status is updated.");
      res.redirect(`/users/${id}`);
      return;
    } catch (err) {
      next(err);
    }
  },
};
