const notFound = require("../../errors/not-found");
const dealLabelsService = require("../../services/admin/deal-labels-service");
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
      const dealLabels = await dealLabelsService.find(optionsObj);
      const { count } = await dealLabelsService.count(optionsObj);

      const pages = Math.ceil(count / limit);

      const paginationLinks = generatePaginationLinks({
        link: "/admin/labels/deals",
        page,
        pages,
        search,
        limit,
        orderBy,
        orderDir,
      });

      return res.render("admin/labels/deals/index", {
        title: "Deal labels",
        dealLabels,
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
      const dealLabel = await dealLabelsService.findOne(id);

      if (!dealLabel) {
        return next(notFound());
      }

      return res.render("admin/labels/deals/show", {
        title: "Show Deal label",
        dealLabel,
      });
    } catch (err) {
      next(err);
    }
  },

  edit: async (req, res, next) => {
    const id = req.params.id;

    try {
      const dealLabel = await dealLabelsService.findOne(id);

      if (!dealLabel) {
        return next(notFound());
      }

      return res.render("admin/labels/deals/edit", {
        title: "Edit Deal label",
        dealLabel,
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
      res.redirect(`/admin/labels/deals/${id}/edit`);
      return;
    }

    try {
      const dealLabel = await dealLabelsService.findOne(id);

      if (!dealLabel) {
        return next(notFound());
      }

      const dealLabelObj = {
        id,
        displayName,
        updatedBy: req.session.currentUser.id,
      };
      await dealLabelsService.update(dealLabelObj);

      req.flash("info", "Deal label is updated.");
      return res.redirect(`/admin/labels/deals/${id}`);
    } catch (err) {
      next(err);
    }
  },

  archive: async (req, res, next) => {
    const id = req.params.id;

    try {
      const dealLabel = await dealLabelsService.findOne(id);

      if (!dealLabel) {
        return next(notFound());
      }

      const dealLabelObj = { id, updatedBy: req.session.currentUser.id };
      await dealLabelsService.archive(dealLabelObj);

      req.flash("info", "Deal label is archived.");
      return res.redirect(`/admin/labels/deals/${id}`);
    } catch (err) {
      next(err);
    }
  },

  active: async (req, res, next) => {
    const id = req.params.id;

    try {
      const dealLabel = await dealLabelsService.findOne(id);

      if (!dealLabel) {
        return next(notFound());
      }

      const dealLabelObj = { id, updatedBy: req.session.currentUser.id };
      await dealLabelsService.active(dealLabelObj);

      req.flash("info", "Deal label is activated.");
      return res.redirect(`/admin/labels/deals/${id}`);
    } catch (err) {
      next(err);
    }
  },

  findActive: async (req, next) => {
    try {
      const dealLabels = await dealLabelsService.findActive();

      let sessionDealLabels = {};
      for (const dealLabel of dealLabels) {
        sessionDealLabels[dealLabel.name] = dealLabel.displayName;
      }
      req.session.dealLabels = sessionDealLabels;
    } catch (err) {
      next(err);
    }
  },
};
