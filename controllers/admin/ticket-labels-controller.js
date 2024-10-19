const ticketLabelsService = require("../../services/admin/ticket-labels-service");
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
      const ticketLabels = await ticketLabelsService.find(optionsObj);
      const { count } = await ticketLabelsService.count(optionsObj);

      const pages = Math.ceil(count / limit);

      const paginationLinks = generatePaginationLinks({
        link: "/admin/labels/tickets",
        page,
        pages,
        search,
        limit,
        orderBy,
        orderDir,
      });

      return res.render("admin/labels/tickets/index", {
        title: "Ticket labels",
        ticketLabels,
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
      const ticketLabel = await ticketLabelsService.findOne(id);

      if (!ticketLabel) {
        req.flash("error", "Ticket label not found.");
        res.redirect("/admin/labels/tickets");
        return;
      }

      res.render("admin/labels/tickets/show", {
        title: "Show Ticket label",
        ticketLabel,
      });
      return;
    } catch (err) {
      next(err);
    }
  },

  edit: async (req, res, next) => {
    const id = req.params.id;

    try {
      const ticketLabel = await ticketLabelsService.findOne(id);

      if (!ticketLabel) {
        req.flash("error", "Ticket label not found.");
        res.redirect("/admin/labels/tickets");
        return;
      }

      res.render("admin/labels/tickets/edit", {
        title: "Edit Ticket label",
        ticketLabel,
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
      res.redirect(`/admin/labels/tickets/${id}/edit`);
      return;
    }

    try {
      const ticketLabel = await ticketLabelsService.findOne(id);

      if (!ticketLabel) {
        req.flash("error", "Ticket label not found.");
        res.redirect("/admin/labels/tickets");
        return;
      }

      const ticketLabelObj = {
        id,
        displayName,
        updatedBy: req.session.currentUser.id,
      };
      await ticketLabelsService.update(ticketLabelObj);

      req.flash("info", "Ticket label is updated.");
      res.redirect(`/admin/labels/tickets/${id}`);
      return;
    } catch (err) {
      next(err);
    }
  },

  archive: async (req, res, next) => {
    const id = req.params.id;

    try {
      const ticketLabel = await ticketLabelsService.findOne(id);

      if (!ticketLabel) {
        req.flash("error", "Ticket label not found.");
        res.redirect("/admin/labels/tickets");
        return;
      }

      const ticketLabelObj = { id, updatedBy: req.session.currentUser.id };
      await ticketLabelsService.archive(ticketLabelObj);

      req.flash("info", "Ticket label is archived.");
      res.redirect(`/admin/labels/tickets/${id}`);
    } catch (err) {
      next(err);
    }
  },

  active: async (req, res, next) => {
    const id = req.params.id;

    try {
      const ticketLabel = await ticketLabelsService.findOne(id);

      if (!ticketLabel) {
        req.flash("error", "Ticket label not found.");
        res.redirect("/admin/labels/tickets");
        return;
      }

      const ticketLabelObj = { id, updatedBy: req.session.currentUser.id };
      await ticketLabelsService.active(ticketLabelObj);

      req.flash("info", "Ticket label is activated.");
      res.redirect(`/admin/labels/tickets/${id}`);
    } catch (err) {
      next(err);
    }
  },
};
