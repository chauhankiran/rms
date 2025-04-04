const notFound = require("../../errors/not-found");
const moduleLabelsService = require("../../services/admin/module-labels-service");
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
      const moduleLabels = await moduleLabelsService.find(optionsObj);
      const { count } = await moduleLabelsService.count(optionsObj);

      const pages = Math.ceil(count / limit);

      const paginationLinks = generatePaginationLinks({
        link: "/admin/labels/modules",
        page,
        pages,
        search,
        limit,
        orderBy,
        orderDir,
      });

      return res.render("admin/labels/modules/index", {
        title: "Module labels",
        moduleLabels,
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
      const moduleLabel = await moduleLabelsService.findOne(id);

      if (!moduleLabel) {
        return next(notFound());
      }

      return res.render("admin/labels/modules/show", {
        title: "Show module label",
        moduleLabel,
      });
    } catch (err) {
      next(err);
    }
  },

  edit: async (req, res, next) => {
    const id = req.params.id;

    try {
      const moduleLabel = await moduleLabelsService.findOne(id);

      if (!moduleLabel) {
        return next(notFound());
      }

      return res.render("admin/labels/modules/edit", {
        title: "Edit module label",
        moduleLabel,
      });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    const id = req.params.id;
    const { displayName } = req.body;

    if (!displayName) {
      req.flash("error", "Display name is required.");
      return res.redirect(`/admin/labels/modules/${id}/edit`);
    }

    try {
      const moduleLabel = await moduleLabelsService.findOne(id);

      if (!moduleLabel) {
        return next(notFound());
      }

      const moduleLabelObj = {
        id,
        displayName,
        updatedBy: req.session.currentUser.id,
      };
      await moduleLabelsService.update(moduleLabelObj);

      req.flash("info", "Module label is updated.");
      return res.redirect(`/admin/labels/modules/${id}`);
    } catch (err) {
      next(err);
    }
  },

  archive: async (req, res, next) => {
    const id = req.params.id;

    try {
      const moduleLabel = await moduleLabelsService.findOne(id);

      if (!moduleLabel) {
        return next(notFound());
      }

      const moduleLabelObj = { id, updatedBy: req.session.currentUser.id };
      await moduleLabelsService.archive(moduleLabelObj);

      req.flash("info", "Module label is archived.");
      return res.redirect(`/admin/labels/modules/${id}`);
    } catch (err) {
      next(err);
    }
  },

  active: async (req, res, next) => {
    const id = req.params.id;

    try {
      const moduleLabel = await moduleLabelsService.findOne(id);

      if (!moduleLabel) {
        return next(notFound());
      }

      const moduleLabelObj = { id, updatedBy: req.session.currentUser.id };
      await moduleLabelsService.active(moduleLabelObj);

      req.flash("info", "Module label is activated.");
      return res.redirect(`/admin/labels/modules/${id}`);
    } catch (err) {
      next(err);
    }
  },

  findActive: async (req, next) => {
    try {
      const moduleLabels = await moduleLabelsService.findActive();

      let sessionModuleLabels = {};
      for (const moduleLabel of moduleLabels) {
        sessionModuleLabels[moduleLabel.name] = moduleLabel.displayName;
      }
      req.session.moduleLabels = sessionModuleLabels;
    } catch (err) {
      next(err);
    }
  },
};
