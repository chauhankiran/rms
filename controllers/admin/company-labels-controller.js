const notFound = require("../../errors/not-found");
const companyLabelsService = require("../../services/admin/company-labels-service");
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
      const companyLabels = await companyLabelsService.find(optionsObj);
      const { count } = await companyLabelsService.count(optionsObj);

      const pages = Math.ceil(count / limit);

      const paginationLinks = generatePaginationLinks({
        link: "/admin/labels/companies",
        page,
        pages,
        search,
        limit,
        orderBy,
        orderDir,
      });

      return res.render("admin/labels/companies/index", {
        title: "Company labels",
        companyLabels,
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
      const companyLabel = await companyLabelsService.findOne(id);

      if (!companyLabel) {
        return next(notFound());
      }

      return res.render("admin/labels/companies/show", {
        title: "Show company label",
        companyLabel,
      });
    } catch (err) {
      next(err);
    }
  },

  edit: async (req, res, next) => {
    const id = req.params.id;

    try {
      const companyLabel = await companyLabelsService.findOne(id);

      if (!companyLabel) {
        return next(notFound());
      }

      return res.render("admin/labels/companies/edit", {
        title: "Edit company label",
        companyLabel,
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
      return res.redirect(`/admin/labels/companies/${id}/edit`);
    }

    try {
      const companyLabel = await companyLabelsService.findOne(id);

      if (!companyLabel) {
        return next(notFound());
      }

      const companyLabelObj = {
        id,
        displayName,
        updatedBy: req.session.currentUser.id,
      };
      await companyLabelsService.update(companyLabelObj);

      req.flash("info", "Company label is updated.");
      return res.redirect(`/admin/labels/companies/${id}`);
    } catch (err) {
      next(err);
    }
  },

  archive: async (req, res, next) => {
    const id = req.params.id;

    try {
      const companyLabel = await companyLabelsService.findOne(id);

      if (!companyLabel) {
        return next(notFound());
      }

      const companyLabelObj = { id, updatedBy: req.session.currentUser.id };
      await companyLabelsService.archive(companyLabelObj);

      req.flash("info", "Company label is archived.");
      return res.redirect(`/admin/labels/companies/${id}`);
    } catch (err) {
      next(err);
    }
  },

  active: async (req, res, next) => {
    const id = req.params.id;

    try {
      const companyLabel = await companyLabelsService.findOne(id);

      if (!companyLabel) {
        return next(notFound());
      }

      const companyLabelObj = { id, updatedBy: req.session.currentUser.id };
      await companyLabelsService.active(companyLabelObj);

      req.flash("info", "Company label is activated.");
      return res.redirect(`/admin/labels/companies/${id}`);
    } catch (err) {
      next(err);
    }
  },

  findActive: async (req, next) => {
    try {
      const companyLabels = await companyLabelsService.findActive();

      let sessionCompanyLabels = {};
      for (const companyLabel of companyLabels) {
        sessionCompanyLabels[companyLabel.name] = companyLabel.displayName;
      }
      req.session.companyLabels = sessionCompanyLabels;
    } catch (err) {
      next(err);
    }
  },
};
