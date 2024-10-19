const contactLabelsService = require("../../services/admin/contact-labels-service");
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
      const contactLabels = await contactLabelsService.find(optionsObj);
      const { count } = await contactLabelsService.count(optionsObj);

      const pages = Math.ceil(count / limit);

      const paginationLinks = generatePaginationLinks({
        link: "/admin/labels/contacts",
        page,
        pages,
        search,
        limit,
        orderBy,
        orderDir,
      });

      return res.render("admin/labels/contacts/index", {
        title: "contact labels",
        contactLabels,
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
      const contactLabel = await contactLabelsService.findOne(id);

      if (!contactLabel) {
        req.flash("error", "Contact label not found.");
        res.redirect("/admin/labels/contacts");
        return;
      }

      res.render("admin/labels/contacts/show", {
        title: "Show contact label",
        contactLabel,
      });
      return;
    } catch (err) {
      next(err);
    }
  },

  edit: async (req, res, next) => {
    const id = req.params.id;

    try {
      const contactLabel = await contactLabelsService.findOne(id);

      if (!contactLabel) {
        req.flash("error", "Contact label not found.");
        res.redirect("/admin/labels/contacts");
        return;
      }

      res.render("admin/labels/contacts/edit", {
        title: "Edit contact label",
        contactLabel,
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
      res.redirect(`/admin/labels/contacts/${id}/edit`);
      return;
    }

    try {
      const contactLabel = await contactLabelsService.findOne(id);

      if (!contactLabel) {
        req.flash("error", "Contact label not found.");
        res.redirect("/admin/labels/contacts");
        return;
      }

      const contactLabelObj = {
        id,
        displayName,
        updatedBy: req.session.currentUser.id,
      };
      await contactLabelsService.update(contactLabelObj);

      req.flash("info", "Contact label is updated.");
      res.redirect(`/admin/labels/contacts/${id}`);
      return;
    } catch (err) {
      next(err);
    }
  },

  archive: async (req, res, next) => {
    const id = req.params.id;

    try {
      const contactLabel = await contactLabelsService.findOne(id);

      if (!contactLabel) {
        req.flash("error", "Contact label not found.");
        res.redirect("/admin/labels/contacts");
        return;
      }

      const contactLabelObj = { id, updatedBy: req.session.currentUser.id };
      await contactLabelsService.archive(contactLabelObj);

      req.flash("info", "Contact label is archived.");
      res.redirect(`/admin/labels/contacts/${id}`);
    } catch (err) {
      next(err);
    }
  },

  active: async (req, res, next) => {
    const id = req.params.id;

    try {
      const contactLabel = await contactLabelsService.findOne(id);

      if (!contactLabel) {
        req.flash("error", "Contact label not found.");
        res.redirect("/admin/labels/contacts");
        return;
      }

      const contactLabelObj = { id, updatedBy: req.session.currentUser.id };
      await contactLabelsService.active(contactLabelObj);

      req.flash("info", "Contact label is activated.");
      res.redirect(`/admin/labels/contacts/${id}`);
    } catch (err) {
      next(err);
    }
  },
};
