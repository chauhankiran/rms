const ticketsService = require("../services/tickets-service");
const generatePaginationLinks = require("../helpers/generate-pagination-links");
const sql = require("../db/sql");
const ticketTypesService = require("../services/admin/ticket-types-service");

const handleTicket = async (id, req, res) => {
  const ticket = await ticketsService.findOne(id);

  if (!ticket) {
    req.flash("error", "Ticket not found.");
    res.redirect("/tickets");
    return;
  }

  return ticket;
};

module.exports = {
  index: async (req, res, next) => {
    const search = req.query.search || null;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const orderBy = req.query.orderBy || "id";
    const orderDir = req.query.orderDir || "DESC";

    try {
      const ticketViews = await sql`
        SELECT
          name
        FROM
          "ticketViews"
      `;

      let columns = 't."isActive",';
      let headers = [];
      for (const ticketView of ticketViews) {
        // id
        if (ticketView.name === "id") {
          columns += "t.id,";
          headers.push("id");
        }

        // name
        if (ticketView.name === "name") {
          columns += "t.name,";
          headers.push("name");
        }

        // ticketTypeId
        if (ticketView.name === "ticketTypeId") {
          columns += 'tt.name AS "ticketType",';
          headers.push("ticketTypeId");
        }

        // updatedBy
        if (ticketView.name === "updatedBy") {
          columns += 'updater."email" AS "updatedByEmail",';
          headers.push("updatedBy");
        }

        // updatedAt
        if (ticketView.name === "updatedAt") {
          columns += 't."updatedAt",';
          headers.push("updatedAt");
        }
      }

      // TEMP: Track the issue
      // https://github.com/porsager/postgres/issues/894
      if (columns.length > 0 && columns.slice(-1) === ",") {
        columns = columns.slice(0, -1);
      }

      const optionsObj = { search, limit, skip, orderBy, orderDir, columns };
      const tickets = await ticketsService.find(optionsObj);
      const { count } = await ticketsService.count(optionsObj);

      const pages = Math.ceil(count / limit);

      const paginationLinks = generatePaginationLinks({
        link: "/tickets",
        page,
        pages,
        search,
        limit,
        orderBy,
        orderDir,
      });

      return res.render("tickets/index", {
        title: "Tickets",
        tickets,
        paginationLinks,
        search,
        count,
        orderBy,
        orderDir,
        headers,
      });
    } catch (err) {
      next(err);
    }
  },

  new: async (req, res, next) => {
    try {
      const ticketTypes = await ticketTypesService.pluck(["id", "name"]);

      return res.render("tickets/new", {
        title: "New ticket",
        ticketTypes,
      });
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    const { name, description, ticketTypeId, companyId, contactId, dealId } =
      req.body;

    if (!name) {
      req.flash("error", "Name is required.");
      res.redirect(`/tickets/new`);
      return;
    }

    try {
      const ticketObj = {
        name,
        description,
        ticketTypeId,
        companyId: companyId || null,
        contactId: contactId || null,
        dealId: dealId || null,
        createdBy: req.session.currentUser.id,
      };
      await ticketsService.create(ticketObj);

      req.flash("info", "Ticket is created.");
      res.redirect("/tickets");
      return;
    } catch (err) {
      next(err);
    }
  },

  show: async (req, res, next) => {
    const id = req.params.id;

    try {
      const ticket = await handleTicket(id, req, res);

      return res.render("tickets/show", {
        title: "Show ticket",
        ticket,
      });
    } catch (err) {
      next(err);
    }
  },

  edit: async (req, res, next) => {
    const id = req.params.id;

    try {
      const ticket = await handleTicket(id, req, res);

      const ticketTypes = await ticketTypesService.pluck(["id", "name"]);

      return res.render("tickets/edit", {
        title: "Edit ticket",
        ticket,
        ticketTypes,
      });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    const id = req.params.id;
    const { name, description, ticketTypeId } = req.body;

    if (!name) {
      req.flash("error", "Name is required.");
      res.redirect(`/tickets/${id}/edit`);
      return;
    }

    try {
      await handleTicket(id, req, res);

      const ticketObj = {
        id,
        name,
        description,
        ticketTypeId,
        updatedBy: req.session.currentUser.id,
      };
      await ticketsService.update(ticketObj);

      req.flash("info", "Ticket is updated.");
      res.redirect(`/tickets/${id}`);
    } catch (err) {
      next(err);
    }
  },

  destroy: async (req, res, next) => {
    const id = req.params.id;

    try {
      await handleTicket(id, req, res);

      await ticketsService.destroy(id);

      req.flash("info", "Ticket is deleted.");
      res.redirect("/tickets");
    } catch (err) {
      next(err);
    }
  },

  archive: async (req, res, next) => {
    const id = req.params.id;

    try {
      await handleTicket(id, req, res);

      const ticketObj = { id, updatedBy: req.session.currentUser.id };
      await ticketsService.archive(ticketObj);

      req.flash("info", "Ticket is archived.");
      res.redirect(`/tickets/${id}`);
    } catch (err) {
      next(err);
    }
  },

  active: async (req, res, next) => {
    const id = req.params.id;

    try {
      await handleTicket(id, req, res);

      const ticketObj = { id, updatedBy: req.session.currentUser.id };
      await ticketsService.active(ticketObj);

      req.flash("info", "Ticket is activated.");
      res.redirect(`/tickets/${id}`);
    } catch (err) {
      next(err);
    }
  },
};
