const dealSourcesService = require("../../services/admin/deal-sources-service");
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
      const dealSources = await dealSourcesService.find(optionsObj);
      const { count } = await dealSourcesService.count(optionsObj);

      const pages = Math.ceil(count / limit);

      const paginationLinks = generatePaginationLinks({
        link: "/admin/deal-sources",
        page,
        pages,
        search,
        limit,
        orderBy,
        orderDir,
      });

      return res.render("admin/deal-sources/index", {
        title: "Deal sources",
        dealSources,
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
    res.render("admin/deal-sources/new", { title: "New deal source" });
  },

  create: async (req, res, next) => {
    const { name } = req.body;

    if (!name) {
      req.flash("error", "Name is required.");
      res.redirect("/admin/deal-sources/new");
      return;
    }

    try {
      const dealSourceObj = { name, createdBy: req.session.currentUser.id };
      await dealSourcesService.create(dealSourceObj);

      req.flash("info", "Deal source is created.");
      res.redirect("/admin/deal-sources");
      return;
    } catch (err) {
      next(err);
    }
  },

  show: async (req, res, next) => {
    const id = req.params.id;

    try {
      const dealSource = await dealSourcesService.findOne(id);

      if (!dealSource) {
        req.flash("error", "Deal source not found.");
        res.redirect("/admin/deal-sources");
        return;
      }

      res.render("admin/deal-sources/show", {
        title: "Show deal source",
        dealSource,
      });
      return;
    } catch (err) {
      next(err);
    }
  },

  edit: async (req, res, next) => {
    const id = req.params.id;

    try {
      const dealSource = await dealSourcesService.findOne(id);

      res.render("admin/deal-sources/edit", {
        title: "Edit deal source",
        dealSource,
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
      res.redirect(`/admin/deal-sources/${id}/edit`);
      return;
    }

    try {
      const dealSourceObj = {
        id,
        name,
        updatedBy: req.session.currentUser.id,
      };
      const dealSource = await dealSourcesService.update(dealSourceObj);

      if (!dealSource) {
        req.flash("error", "Problem while updating user.");
        res.redirect(`/admin/deal-sources/${id}`);
        return;
      }

      req.flash("info", "Deal source is updated.");
      res.redirect(`/admin/deal-sources/${id}`);
      return;
    } catch (err) {
      next(err);
    }
  },

  destroy: async (req, res, next) => {
    const id = req.params.id;

    try {
      const dealSource = await dealSourcesService.destroy(id);

      if (!dealSource) {
        req.flash("error", "Problem while deleting deal source.");
        res.redirect(`/admin/deal-sources/${id}`);
        return;
      }

      req.flash("info", "Deal source is deleted.");
      res.redirect("/admin/deal-sources");
    } catch (err) {
      next(err);
    }
  },

  archive: async (req, res, next) => {
    const id = req.params.id;

    try {
      const dealSource = await dealSourcesService.findOne(id);

      if (!dealSource) {
        req.flash("error", "Deal source not found.");
        res.redirect("/admin/deal-sources");
        return;
      }

      const dealSourceObj = { id, updatedBy: req.session.currentUser.id };
      await dealSourcesService.archive(dealSourceObj);

      req.flash("info", "Deal source is archived.");
      res.redirect(`/admin/deal-sources/${id}`);
    } catch (err) {
      next(err);
    }
  },

  active: async (req, res, next) => {
    const id = req.params.id;

    try {
      const dealSource = await dealSourcesService.findOne(id);

      if (!dealSource) {
        req.flash("error", "Deal source not found.");
        res.redirect("/admin/deal-sources");
        return;
      }

      const dealSourceObj = { id, updatedBy: req.session.currentUser.id };
      await dealSourcesService.active(dealSourceObj);

      req.flash("info", "Deal source is activated.");
      res.redirect(`/admin/deal-sources/${id}`);
    } catch (err) {
      next(err);
    }
  },
};