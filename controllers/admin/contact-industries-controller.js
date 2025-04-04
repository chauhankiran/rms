const notFound = require("../../errors/not-found");
const contactIndustriesService = require("../../services/admin/contact-industries-service");
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
      const contactIndustries = await contactIndustriesService.find(optionsObj);
      const { count } = await contactIndustriesService.count(optionsObj);

      const pages = Math.ceil(count / limit);

      const paginationLinks = generatePaginationLinks({
        link: "/admin/contact-industries",
        page,
        pages,
        search,
        limit,
        orderBy,
        orderDir,
      });

      return res.render("admin/contact-industries/index", {
        title: "Contact industries",
        contactIndustries,
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
    res.render("admin/contact-industries/new", {
      title: "New Contact industry",
    });
  },

  create: async (req, res, next) => {
    const { name } = req.body;

    if (!name) {
      req.flash("error", "Name is required.");
      return res.redirect("/admin/contact-industries/new");
    }

    try {
      const contactIndustryObj = {
        name,
        createdBy: req.session.currentUser.id,
      };
      await contactIndustriesService.create(contactIndustryObj);

      req.flash("info", "Contact industry is created.");
      return res.redirect("/admin/contact-industries");
    } catch (err) {
      next(err);
    }
  },

  show: async (req, res, next) => {
    const id = req.params.id;

    try {
      const contactIndustry = await contactIndustriesService.findOne(id);

      if (!contactIndustry) {
        return next(notFound());
      }

      return res.render("admin/contact-industries/show", {
        title: "Show contact industry",
        contactIndustry,
      });
    } catch (err) {
      next(err);
    }
  },

  edit: async (req, res, next) => {
    const id = req.params.id;

    try {
      const contactIndustry = await contactIndustriesService.findOne(id);

      if (!contactIndustry) {
        return next(notFound());
      }

      return res.render("admin/contact-industries/edit", {
        title: "Edit contact industry",
        contactIndustry,
      });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    const id = req.params.id;
    const { name } = req.body;

    if (!name) {
      req.flash("error", "Name is required.");
      return res.redirect(`/admin/contact-industries/${id}/edit`);
    }

    try {
      const contactIndustry = await contactIndustriesService.findOne(id);

      if (!contactIndustry) {
        return next(notFound());
      }

      const contactIndustryObj = {
        id,
        name,
        updatedBy: req.session.currentUser.id,
      };
      await contactIndustriesService.update(contactIndustryObj);

      req.flash("info", "Contact industry is updated.");
      return res.redirect(`/admin/contact-industries/${id}`);
    } catch (err) {
      next(err);
    }
  },

  destroy: async (req, res, next) => {
    const id = req.params.id;

    try {
      const contactIndustry = await contactIndustriesService.findOne(id);

      if (!contactIndustry) {
        return next(notFound());
      }

      await contactIndustriesService.destroy(id);

      req.flash("info", "Contact industry is deleted.");
      return res.redirect("/admin/contact-industries");
    } catch (err) {
      next(err);
    }
  },

  archive: async (req, res, next) => {
    const id = req.params.id;

    try {
      const contactIndustry = await contactIndustriesService.findOne(id);

      if (!contactIndustry) {
        return next(notFound());
      }

      const contactIndustryObj = { id, updatedBy: req.session.currentUser.id };
      await contactIndustriesService.archive(contactIndustryObj);

      req.flash("info", "Contact industry is archived.");
      return res.redirect(`/admin/contact-industries/${id}`);
    } catch (err) {
      next(err);
    }
  },

  active: async (req, res, next) => {
    const id = req.params.id;

    try {
      const contactIndustry = await contactIndustriesService.findOne(id);

      if (!contactIndustry) {
        return next(notFound());
      }

      const contactIndustryObj = { id, updatedBy: req.session.currentUser.id };
      await contactIndustriesService.active(contactIndustryObj);

      req.flash("info", "Contact industry is activated.");
      return res.redirect(`/admin/contact-industries/${id}`);
    } catch (err) {
      next(err);
    }
  },
};
