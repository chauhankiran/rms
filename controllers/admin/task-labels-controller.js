const taskLabelsService = require("../../services/admin/task-labels-service");
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
      const taskLabels = await taskLabelsService.find(optionsObj);
      const { count } = await taskLabelsService.count(optionsObj);

      const pages = Math.ceil(count / limit);

      const paginationLinks = generatePaginationLinks({
        link: "/admin/labels/tasks",
        page,
        pages,
        search,
        limit,
        orderBy,
        orderDir,
      });

      return res.render("admin/labels/tasks/index", {
        title: "Task labels",
        taskLabels,
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

  show: async (req, res, next) => {
    const id = req.params.id;

    try {
      const taskLabel = await taskLabelsService.findOne(id);

      if (!taskLabel) {
        req.flash("error", "Task label not found.");
        res.redirect("/admin/labels/tasks");
        return;
      }

      res.render("admin/labels/tasks/show", {
        title: "Show Task label",
        taskLabel,
      });
      return;
    } catch (err) {
      next(err);
    }
  },

  edit: async (req, res, next) => {
    const id = req.params.id;

    try {
      const taskLabel = await taskLabelsService.findOne(id);

      if (!taskLabel) {
        req.flash("error", "Task label not found.");
        res.redirect("/admin/labels/tasks");
        return;
      }

      res.render("admin/labels/tasks/edit", {
        title: "Edit Task label",
        taskLabel,
      });
      return;
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    const id = req.params.id;
    const { displayName } = req.body;

    if (!displayName) {
      req.flash("error", "Display name is required.");
      res.redirect(`/admin/labels/tasks/${id}/edit`);
      return;
    }

    try {
      const taskLabel = await taskLabelsService.findOne(id);

      if (!taskLabel) {
        req.flash("error", "Task label not found.");
        res.redirect("/admin/labels/tasks");
        return;
      }

      const taskLabelObj = {
        id,
        displayName,
        updatedBy: req.session.currentUser.id,
      };
      await taskLabelsService.update(taskLabelObj);

      req.flash("info", "Task label is updated.");
      res.redirect(`/admin/labels/tasks/${id}`);
      return;
    } catch (err) {
      next(err);
    }
  },

  archive: async (req, res, next) => {
    const id = req.params.id;

    try {
      const taskLabel = await taskLabelsService.findOne(id);

      if (!taskLabel) {
        req.flash("error", "Task label not found.");
        res.redirect("/admin/labels/tasks");
        return;
      }

      const taskLabelObj = { id, updatedBy: req.session.currentUser.id };
      await taskLabelsService.archive(taskLabelObj);

      req.flash("info", "Task label is archived.");
      res.redirect(`/admin/labels/tasks/${id}`);
    } catch (err) {
      next(err);
    }
  },

  active: async (req, res, next) => {
    const id = req.params.id;

    try {
      const taskLabel = await taskLabelsService.findOne(id);

      if (!taskLabel) {
        req.flash("error", "Task label not found.");
        res.redirect("/admin/labels/tasks");
        return;
      }

      const taskLabelObj = { id, updatedBy: req.session.currentUser.id };
      await taskLabelsService.active(taskLabelObj);

      req.flash("info", "Task label is activated.");
      res.redirect(`/admin/labels/tasks/${id}`);
    } catch (err) {
      next(err);
    }
  },
};
