const companySourcesService = require("../../services/admin/company-sources-service");
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
      const companySources = await companySourcesService.find(optionsObj);
      const { count } = await companySourcesService.count(optionsObj);

      const pages = Math.ceil(count / limit);

      const paginationLinks = generatePaginationLinks({
        link: "/admin/company-sources",
        page,
        pages,
        search,
        limit,
        orderBy,
        orderDir,
      });

      return res.render("admin/company-sources/index", {
        title: "Company sources",
        companySources,
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
    res.render("admin/company-sources/new", { title: "New company sources" });
  },

  create: async (req, res, next) => {
    const { name } = req.body;

    if (!name) {
      req.flash("error", "Name is required.");
      res.redirect("/admin/company-sources/new");
      return;
    }

    try {
      const companySourceObj = { name, createdBy: req.session.currentUser.id };
      await companySourcesService.create(companySourceObj);

      req.flash("info", "Company source is created.");
      res.redirect("/admin/company-sources");
      return;
    } catch (err) {
      next(err);
    }
  },

  show: async (req, res, next) => {
    const id = req.params.id;

    try {
      const companySource = await companySourcesService.findOne(id);

      if (!companySource) {
        req.flash("error", "Company source not found.");
        res.redirect("/admin/company-sources");
        return;
      }

      res.render("admin/company-sources/show", {
        title: "Show company source",
        companySource,
      });
      return;
    } catch (err) {
      next(err);
    }
  },

  edit: async (req, res, next) => {
    const id = req.params.id;

    try {
      const companySource = await companySourcesService.findOne(id);

      res.render("admin/company-sources/edit", {
        title: "Edit company source",
        companySource,
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
      res.redirect(`/admin/company-sources/${id}/edit`);
      return;
    }

    try {
      const companySourceObj = {
        id,
        name,
        updatedBy: req.session.currentUser.id,
      };
      const companySource =
        await companySourcesService.update(companySourceObj);

      if (!companySource) {
        req.flash("error", "Problem while updating user.");
        res.redirect(`/admin/company-sources/${id}`);
        return;
      }

      req.flash("info", "Company source is updated.");
      res.redirect(`/admin/company-sources/${id}`);
      return;
    } catch (err) {
      next(err);
    }
  },

  destroy: async (req, res, next) => {
    const id = req.params.id;

    try {
      const companySource = await companySourcesService.destroy(id);

      if (!companySource) {
        req.flash("error", "Problem while deleting company source.");
        res.redirect(`/admin/company-sources/${id}`);
        return;
      }

      req.flash("info", "Company sources is deleted.");
      res.redirect("/admin/company-sources");
    } catch (err) {
      next(err);
    }
  },

  archive: async (req, res, next) => {
    const id = req.params.id;

    try {
      const companySource = await companySourcesService.findOne(id);

      if (!companySource) {
        req.flash("error", "Company source not found.");
        res.redirect("/admin/company-sources");
        return;
      }

      const companySourceObj = { id, updatedBy: req.session.currentUser.id };
      await companySourcesService.archive(companySourceObj);

      req.flash("info", "Company source is archived.");
      res.redirect(`/admin/company-sources/${id}`);
    } catch (err) {
      next(err);
    }
  },

  active: async (req, res, next) => {
    const id = req.params.id;

    try {
      const companySource = await companySourcesService.findOne(id);

      if (!companySource) {
        req.flash("error", "Company source not found.");
        res.redirect("/admin/company-sources");
        return;
      }

      const companySourceObj = { id, updatedBy: req.session.currentUser.id };
      await companySourcesService.active(companySourceObj);

      req.flash("info", "Company source is activated.");
      res.redirect(`/admin/company-sources/${id}`);
    } catch (err) {
      next(err);
    }
  },
};
