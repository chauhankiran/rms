const notFound = require("../../errors/not-found");
const ticketTypesService = require("../../services/admin/ticket-types-service");
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
      const ticketTypes = await ticketTypesService.find(optionsObj);
      const { count } = await ticketTypesService.count(optionsObj);

      const pages = Math.ceil(count / limit);

      const paginationLinks = generatePaginationLinks({
        link: "/admin/ticket-types",
        page,
        pages,
        search,
        limit,
        orderBy,
        orderDir,
      });

      return res.render("admin/ticket-types/index", {
        title: "Ticket types",
        ticketTypes,
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
    res.render("admin/ticket-types/new", {
      title: "New ticket type",
    });
  },

  create: async (req, res, next) => {
    const { name } = req.body;

    if (!name) {
      req.flash("error", "Name is required.");
      return res.redirect("/admin/ticket-types/new");
    }

    try {
      const ticketTypeObj = {
        name,
        createdBy: req.session.currentUser.id,
      };
      await ticketTypesService.create(ticketTypeObj);

      req.flash("info", "Ticket type is created.");
      return res.redirect("/admin/ticket-types");
    } catch (err) {
      next(err);
    }
  },

  show: async (req, res, next) => {
    const id = req.params.id;

    try {
      const ticketType = await ticketTypesService.findOne(id);

      if (!ticketType) {
        return next(notFound());
      }

      return res.render("admin/ticket-types/show", {
        title: "Show ticket type",
        ticketType,
      });
    } catch (err) {
      next(err);
    }
  },

  edit: async (req, res, next) => {
    const id = req.params.id;

    try {
      const ticketType = await ticketTypesService.findOne(id);

      if (!ticketType) {
        return next(notFound());
      }

      return res.render("admin/ticket-types/edit", {
        title: "Edit ticket type",
        ticketType,
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
      return res.redirect(`/admin/ticket-types/${id}/edit`);
    }

    try {
      const ticketType = await ticketTypesService.findOne(id);

      if (!ticketType) {
        return next(notFound());
      }

      const ticketTypeObj = {
        id,
        name,
        updatedBy: req.session.currentUser.id,
      };
      await ticketTypesService.update(ticketTypeObj);

      req.flash("info", "Ticket type is updated.");
      return res.redirect(`/admin/ticket-types/${id}`);
    } catch (err) {
      next(err);
    }
  },

  destroy: async (req, res, next) => {
    const id = req.params.id;

    try {
      const ticketType = await ticketTypesService.findOne(id);

      if (!ticketType) {
        return next(notFound());
      }

      await ticketTypesService.destroy(id);

      req.flash("info", "Ticket type is deleted.");
      return res.redirect("/admin/ticket-types");
    } catch (err) {
      next(err);
    }
  },

  archive: async (req, res, next) => {
    const id = req.params.id;

    try {
      const ticketType = await ticketTypesService.findOne(id);

      if (!ticketType) {
        return next(notFound());
      }

      const ticketTypeObj = { id, updatedBy: req.session.currentUser.id };
      await ticketTypesService.archive(ticketTypeObj);

      req.flash("info", "Ticket type is archived.");
      return res.redirect(`/admin/ticket-types/${id}`);
    } catch (err) {
      next(err);
    }
  },

  active: async (req, res, next) => {
    const id = req.params.id;

    try {
      const ticketType = await ticketTypesService.findOne(id);

      if (!ticketType) {
        return next(notFound());
      }

      const ticketTypeObj = { id, updatedBy: req.session.currentUser.id };
      await ticketTypesService.active(ticketTypeObj);

      req.flash("info", "Ticket type is activated.");
      return res.redirect(`/admin/ticket-types/${id}`);
    } catch (err) {
      next(err);
    }
  },
};
