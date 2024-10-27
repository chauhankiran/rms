const notFound = require("../../errors/not-found");
const quoteLabelsService = require("../../services/admin/quote-labels-service");
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
      const quoteLabels = await quoteLabelsService.find(optionsObj);
      const { count } = await quoteLabelsService.count(optionsObj);

      const pages = Math.ceil(count / limit);

      const paginationLinks = generatePaginationLinks({
        link: "/admin/labels/quotes",
        page,
        pages,
        search,
        limit,
        orderBy,
        orderDir,
      });

      return res.render("admin/labels/quotes/index", {
        title: "Quote labels",
        quoteLabels,
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
      const quoteLabel = await quoteLabelsService.findOne(id);

      if (!quoteLabel) {
        return next(notFound());
      }

      return res.render("admin/labels/quotes/show", {
        title: "Show Quote label",
        quoteLabel,
      });
    } catch (err) {
      next(err);
    }
  },

  edit: async (req, res, next) => {
    const id = req.params.id;

    try {
      const quoteLabel = await quoteLabelsService.findOne(id);

      if (!quoteLabel) {
        return next(notFound());
      }

      return res.render("admin/labels/quotes/edit", {
        title: "Edit Quote label",
        quoteLabel,
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
      return res.redirect(`/admin/labels/quotes/${id}/edit`);
    }

    try {
      const quoteLabel = await quoteLabelsService.findOne(id);

      if (!quoteLabel) {
        return next(notFound());
      }

      const quoteLabelObj = {
        id,
        displayName,
        updatedBy: req.session.currentUser.id,
      };
      await quoteLabelsService.update(quoteLabelObj);

      req.flash("info", "Quote label is updated.");
      return res.redirect(`/admin/labels/quotes/${id}`);
    } catch (err) {
      next(err);
    }
  },

  archive: async (req, res, next) => {
    const id = req.params.id;

    try {
      const quoteLabel = await quoteLabelsService.findOne(id);

      if (!quoteLabel) {
        return next(notFound());
      }

      const quoteLabelObj = { id, updatedBy: req.session.currentUser.id };
      await quoteLabelsService.archive(quoteLabelObj);

      req.flash("info", "Quote label is archived.");
      return res.redirect(`/admin/labels/quotes/${id}`);
    } catch (err) {
      next(err);
    }
  },

  active: async (req, res, next) => {
    const id = req.params.id;

    try {
      const quoteLabel = await quoteLabelsService.findOne(id);

      if (!quoteLabel) {
        return next(notFound());
      }

      const quoteLabelObj = { id, updatedBy: req.session.currentUser.id };
      await quoteLabelsService.active(quoteLabelObj);

      req.flash("info", "Quote label is activated.");
      return res.redirect(`/admin/labels/quotes/${id}`);
    } catch (err) {
      next(err);
    }
  },

  findActive: async (req, next) => {
    try {
      const quoteLabels = await quoteLabelsService.findActive();

      let sessionQuoteLabels = {};
      for (const quoteLabel of quoteLabels) {
        sessionQuoteLabels[quoteLabel.name] = quoteLabel.displayName;
      }
      req.session.quoteLabels = sessionQuoteLabels;
    } catch (err) {
      next(err);
    }
  },
};
