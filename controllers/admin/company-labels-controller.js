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
        req.flash("error", "Company label not found.");
        res.redirect("/admin/labels/companies");
        return;
      }

      res.render("admin/labels/companies/show", {
        title: "Show company label",
        companyLabel,
      });
      return;
    } catch (err) {
      next(err);
    }
  },

  edit: async (req, res, next) => {
    const id = req.params.id;

    try {
      const companyLabel = await companyLabelsService.findOne(id);

      if (!companyLabel) {
        req.flash("error", "Company label not found.");
        res.redirect("/admin/labels/companies");
        return;
      }

      res.render("admin/labels/companies/edit", {
        title: "Edit company label",
        companyLabel,
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
      res.redirect(`/admin/labels/companies/${id}/edit`);
      return;
    }

    try {
      const companyLabel = await companyLabelsService.findOne(id);

      if (!companyLabel) {
        req.flash("error", "Company label not found.");
        res.redirect("/admin/labels/companies");
        return;
      }

      const companyLabelObj = {
        id,
        displayName,
        updatedBy: req.session.currentUser.id,
      };
      await companyLabelsService.update(companyLabelObj);

      req.flash("info", "Company label is updated.");
      res.redirect(`/admin/labels/companies/${id}`);
      return;
    } catch (err) {
      next(err);
    }
  },

  archive: async (req, res, next) => {
    const id = req.params.id;

    try {
      const companyLabel = await companyLabelsService.findOne(id);

      if (!companyLabel) {
        req.flash("error", "Company label not found.");
        res.redirect("/admin/labels/companies");
        return;
      }

      const companyLabelObj = { id, updatedBy: req.session.currentUser.id };
      await companyLabelsService.archive(companyLabelObj);

      req.flash("info", "Company label is archived.");
      res.redirect(`/admin/labels/companies/${id}`);
    } catch (err) {
      next(err);
    }
  },

  active: async (req, res, next) => {
    const id = req.params.id;

    try {
      const companyLabel = await companyLabelsService.findOne(id);

      if (!companyLabel) {
        req.flash("error", "Company label not found.");
        res.redirect("/admin/labels/companies");
        return;
      }

      const companyLabelObj = { id, updatedBy: req.session.currentUser.id };
      await companyLabelsService.active(companyLabelObj);

      req.flash("info", "Company label is activated.");
      res.redirect(`/admin/labels/companies/${id}`);
    } catch (err) {
      next(err);
    }
  },
};
