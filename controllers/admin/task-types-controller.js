const taskTypesService = require("../../services/admin/task-types-service");
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
      const taskTypes = await taskTypesService.find(optionsObj);
      const { count } = await taskTypesService.count(optionsObj);

      const pages = Math.ceil(count / limit);

      const paginationLinks = generatePaginationLinks({
        link: "/admin/task-types",
        page,
        pages,
        search,
        limit,
        orderBy,
        orderDir,
      });

      return res.render("admin/task-types/index", {
        title: "Task types",
        taskTypes,
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
    res.render("admin/task-types/new", {
      title: "New task type",
    });
  },

  create: async (req, res, next) => {
    const { name } = req.body;

    if (!name) {
      req.flash("error", "Name is required.");
      res.redirect("/admin/task-types/new");
      return;
    }

    try {
      const taskTypeObj = {
        name,
        createdBy: req.session.currentUser.id,
      };
      await taskTypesService.create(taskTypeObj);

      req.flash("info", "task type is created.");
      res.redirect("/admin/task-types");
      return;
    } catch (err) {
      next(err);
    }
  },

  show: async (req, res, next) => {
    const id = req.params.id;

    try {
      const taskType = await taskTypesService.findOne(id);

      if (!taskType) {
        req.flash("error", "task type not found.");
        res.redirect("/admin/task-types");
        return;
      }

      res.render("admin/task-types/show", {
        title: "Show task type",
        taskType,
      });
      return;
    } catch (err) {
      next(err);
    }
  },

  edit: async (req, res, next) => {
    const id = req.params.id;

    try {
      const taskType = await taskTypesService.findOne(id);

      if (!taskType) {
        req.flash("error", "task type not found.");
        res.redirect("/admin/task-types");
        return;
      }

      res.render("admin/task-types/edit", {
        title: "Edit task type",
        taskType,
      });
      return;
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    const id = req.params.id;
    const { name } = req.body;

    if (!name) {
      req.flash("error", "Name is required.");
      res.redirect(`/admin/task-types/${id}/edit`);
      return;
    }

    try {
      const taskType = await taskTypesService.findOne(id);

      if (!taskType) {
        req.flash("error", "task type not found.");
        res.redirect("/admin/task-types");
        return;
      }

      const taskTypeObj = {
        id,
        name,
        updatedBy: req.session.currentUser.id,
      };
      await taskTypesService.update(taskTypeObj);

      req.flash("info", "task type is updated.");
      res.redirect(`/admin/task-types/${id}`);
      return;
    } catch (err) {
      next(err);
    }
  },

  destroy: async (req, res, next) => {
    const id = req.params.id;

    try {
      const taskType = await taskTypesService.findOne(id);

      if (!taskType) {
        req.flash("error", "task type not found.");
        res.redirect("/admin/task-types");
        return;
      }

      await taskTypesService.destroy(id);

      req.flash("info", "task type is deleted.");
      res.redirect("/admin/task-types");
    } catch (err) {
      next(err);
    }
  },

  archive: async (req, res, next) => {
    const id = req.params.id;

    try {
      const taskType = await taskTypesService.findOne(id);

      if (!taskType) {
        req.flash("error", "task type not found.");
        res.redirect("/admin/task-types");
        return;
      }

      const taskTypeObj = { id, updatedBy: req.session.currentUser.id };
      await taskTypesService.archive(taskTypeObj);

      req.flash("info", "task type is archived.");
      res.redirect(`/admin/task-types/${id}`);
    } catch (err) {
      next(err);
    }
  },

  active: async (req, res, next) => {
    const id = req.params.id;

    try {
      const taskType = await taskTypesService.findOne(id);

      if (!taskType) {
        req.flash("error", "task type not found.");
        res.redirect("/admin/task-types");
        return;
      }

      const taskTypeObj = { id, updatedBy: req.session.currentUser.id };
      await taskTypesService.active(taskTypeObj);

      req.flash("info", "task type is activated.");
      res.redirect(`/admin/task-types/${id}`);
    } catch (err) {
      next(err);
    }
  },
};
