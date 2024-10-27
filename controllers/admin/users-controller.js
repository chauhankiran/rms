const notFound = require("../../errors/not-found");
const bcrypt = require("bcrypt");
const usersService = require("../../services/admin/users-service");
const generatePaginationLinks = require("../../helpers/generate-pagination-links");

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

      const paginationLinks = generatePaginationLinks({
        link: "/admin/users",
        page,
        pages,
        search,
        limit,
        orderBy,
        orderDir,
      });

      return res.render("admin/users/index", {
        title: "Users",
        users,
        paginationLinks,
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
    return res.render("admin/users/new", { title: "New user" });
  },

  create: async (req, res, next) => {
    const { email, password } = req.body;

    if (!email) {
      req.flash("error", "Email is required.");
      return res.redirect("/admin/users/new");
    }

    if (!password) {
      req.flash("error", "Password is required.");
      return res.redirect("/admin/users/new");
    }

    try {
      const userObj = {
        email,
        password,
        createdBy: req.session.currentUser.id,
      };
      await usersService.create(userObj);

      req.flash("info", "User is created.");
      return res.redirect("/admin/users");
    } catch (err) {
      next(err);
    }
  },

  show: async (req, res, next) => {
    const id = req.params.id;

    try {
      const user = await usersService.findOne(id);

      if (!user) {
        return next(notFound());
      }

      return res.render("admin/users/show", { title: user.email, user });
    } catch (err) {
      next(err);
    }
  },

  edit: async (req, res, next) => {
    const id = req.params.id;

    try {
      const user = await usersService.findOne(id);

      if (!user) {
        return next(notFound());
      }

      return res.render("admin/users/edit", { title: "Edit user", user });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    const id = req.params.id;
    const { email, password } = req.body;

    if (!email) {
      req.flash("error", "Email is required.");
      return res.redirect(`/admin/users/${id}/edit`);
    }

    if (!password) {
      req.flash("error", "Password is required.");
      return res.redirect(`/admin/users/${id}/edit`);
    }

    try {
      const user = await usersService.findOne(id);

      if (!user) {
        return next(notFound());
      }

      // Hashing
      const salt = bcrypt.genSaltSync();
      const passwordHash = bcrypt.hashSync(password, salt);

      const userObj = {
        id,
        email,
        password: passwordHash,
        updatedBy: req.session.currentUser.id,
      };
      await usersService.update(userObj);

      req.flash("info", "User is updated.");
      return res.redirect(`/admin/users/${id}`);
    } catch (err) {
      next(err);
    }
  },

  destroy: async (req, res, next) => {
    const id = req.params.id;

    try {
      const user = await usersService.findOne(id);

      if (!user) {
        return next(notFound());
      }

      await usersService.destroy(id);

      req.flash("info", "User is deleted.");
      return res.redirect("/admin/users");
    } catch (err) {
      next(err);
    }
  },

  archive: async (req, res, next) => {
    const id = req.params.id;

    try {
      const user = await usersService.findOne(id);

      if (!user) {
        return next(notFound());
      }

      const userObj = { id, newUserStatus: !user.isActive };
      await usersService.archive(userObj);

      req.flash("info", "User status is updated.");
      return res.redirect(`/admin/users/${id}`);
    } catch (err) {
      next(err);
    }
  },

  massActionsActive: async (req, res, next) => {
    const toActiveUserIds = req.body.toActiveUserIds;
    const userIds = toActiveUserIds.split(",").map(Number);

    const userObj = { userIds, updatedBy: req.session.currentUser.id };
    try {
      await usersService.massActive(userObj);

      req.flash("info", "Users are activated.");
      return res.redirect("/admin/users");
    } catch (err) {
      next(err);
    }
  },

  massActionsDeActive: async (req, res, next) => {
    const toDeActiveUserIds = req.body.toDeActiveUserIds;
    const userIds = toDeActiveUserIds.split(",").map(Number);

    const userObj = { userIds, updatedBy: req.session.currentUser.id };
    try {
      await usersService.massDeActive(userObj);

      req.flash("info", "Users are de-activated.");
      return res.redirect("/admin/users");
    } catch (err) {
      next(err);
    }
  },

  massActionsDelete: async (req, res, next) => {
    const deleteUserIds = req.body.deleteUserIds;
    const userIds = deleteUserIds.split(",").map(Number);

    const userObj = { userIds };
    try {
      await usersService.massDelete(userObj);

      req.flash("info", "Users are deleted.");
      return res.redirect("/admin/users");
    } catch (err) {
      next(err);
    }
  },
};
