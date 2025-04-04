const notFound = require("../errors/not-found");
const dealsService = require("../services/deals-service");
const dealViewsService = require("../services/deal-views-service");
const dealSourcesService = require("../services/admin/deal-sources-service");
const quotesService = require("../services/quotes-service");
const ticketsService = require("../services/tickets-service");
const tasksService = require("../services/tasks-service");
const generatePaginationLinks = require("../helpers/generate-pagination-links");
const capitalize = require("../helpers/capitalize");
const pluralize = require("pluralize");

const columnsObj = {
  id: "d.id",
  name: "d.name",
  total: "d.total",
  dealSourceId: 'ds.name AS "dealSource"',
  createdBy: 'creator.email AS "createdByEmail"',
  createdAt: 'd."createdAt"',
  updatedBy: 'updater.email AS "updatedByEmail"',
  updatedAt: 'd."updatedAt"',
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
      const dealViews = await dealViewsService.pluck(["name"]);

      let columns = 'd."isActive",';
      let headers = [];
      for (const dealView of dealViews) {
        const column = columnsObj[dealView.name];
        if (column) {
          columns += `${column},`;
          headers.push(dealView.name);
        }
      }

      // TEMP: Track the issue
      // https://github.com/porsager/postgres/issues/894
      columns = columns.endsWith(",") ? columns.slice(0, -1) : columns;

      const optionsObj = { search, limit, skip, orderBy, orderDir, columns };
      const deals = await dealsService.find(optionsObj);
      const { count } = await dealsService.count(optionsObj);

      const pages = Math.ceil(count / limit);

      const paginationLinks = generatePaginationLinks({
        link: "/deals",
        page,
        pages,
        search,
        limit,
        orderBy,
        orderDir,
      });

      return res.render("deals/index", {
        title: capitalize(req.session.labels.module.deal),
        deals,
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
    const companyId = req.query.companyId;
    const contactId = req.query.contactId;

    try {
      const dealSources = await dealSourcesService.pluck(["id", "name"]);

      return res.render("deals/new", {
        title:
          "New " +
          pluralize.singular(req.session.labels.module.deal.toLowerCase()),
        dealSources,
        companyId,
        contactId,
      });
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    const { name, total, description, dealSourceId, companyId, contactId } =
      req.body;

    if (!name) {
      req.flash("error", "Name is required.");
      return res.redirect(`/deals/new`);
    }

    try {
      const dealObj = {
        name,
        total,
        description,
        dealSourceId,
        companyId: companyId || null,
        contactId: contactId || null,
        createdBy: req.session.currentUser.id,
      };
      await dealsService.create(dealObj);

      req.flash("info", "Deal is created.");
      return res.redirect("/deals");
    } catch (err) {
      next(err);
    }
  },

  show: async (req, res, next) => {
    const id = req.params.id;

    try {
      const deal = await dealsService.findOne(id);

      if (!deal) {
        return next(notFound());
      }

      // Get all associated quotes.
      const optionsObj = {
        skip: 0,
        limit: 100,
        orderBy: "id",
        orderDir: "DESC",
        dealId: deal.id,
        columns: [
          "q.id",
          "q.name",
          'updater.email AS "updatedByEmail"',
          'q."updatedAt"',
        ],
      };
      const quotes = await quotesService.find(optionsObj);

      // Get all associated tickets.
      const optionsObj2 = {
        skip: 0,
        limit: 100,
        orderBy: "id",
        orderDir: "DESC",
        dealId: deal.id,
        columns: [
          "t.id",
          "t.name",
          'updater.email AS "updatedByEmail"',
          't."updatedAt"',
        ],
      };
      const tickets = await ticketsService.find(optionsObj2);

      // Get all associated tasks.
      const optionsObj3 = {
        skip: 0,
        limit: 100,
        orderBy: "id",
        orderDir: "DESC",
        dealId: deal.id,
        columns: [
          "t.id",
          "t.name",
          'updater.email AS "updatedByEmail"',
          't."updatedAt"',
        ],
      };
      const tasks = await tasksService.find(optionsObj3);

      return res.render("deals/show", {
        title:
          "Show " +
          pluralize.singular(req.session.labels.module.deal.toLowerCase()),
        deal,
        quotes,
        tickets,
        tasks,
      });
    } catch (err) {
      next(err);
    }
  },

  edit: async (req, res, next) => {
    const id = req.params.id;

    try {
      const deal = await dealsService.findOne(id);

      if (!deal) {
        return next(notFound());
      }

      const dealSources = await dealSourcesService.pluck(["id", "name"]);

      return res.render("deals/edit", {
        title:
          "Edit " +
          pluralize.singular(req.session.labels.module.deal.toLowerCase()),
        deal,
        dealSources,
      });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    const id = req.params.id;
    const { name, total, description, dealSourceId } = req.body;

    if (!name) {
      req.flash("error", "Name is required.");
      return res.redirect(`/deals/${id}/edit`);
    }

    try {
      const deal = await dealsService.findOne(id);

      if (!deal) {
        return next(notFound());
      }

      const dealObj = {
        id,
        name,
        total,
        description,
        dealSourceId,
        updatedBy: req.session.currentUser.id,
      };
      await dealsService.update(dealObj);

      req.flash("info", "Deal is updated.");
      return res.redirect(`/deals/${id}`);
    } catch (err) {
      next(err);
    }
  },

  destroy: async (req, res, next) => {
    const id = req.params.id;

    try {
      const deal = await dealsService.findOne(id);

      if (!deal) {
        return next(notFound());
      }

      await dealsService.destroy(id);

      req.flash("info", "Deal is deleted.");
      return res.redirect("/deals");
    } catch (err) {
      next(err);
    }
  },

  archive: async (req, res, next) => {
    const id = req.params.id;

    try {
      const deal = await dealsService.findOne(id);

      if (!deal) {
        req.flash("error", "Deal not found.");
        return res.redirect("/deals");
      }

      const dealObj = { id, updatedBy: req.session.currentUser.id };
      await dealsService.archive(dealObj);

      req.flash("info", "Deal is archived.");
      return res.redirect(`/deals/${id}`);
    } catch (err) {
      next(err);
    }
  },

  active: async (req, res, next) => {
    const id = req.params.id;

    try {
      const deal = await dealsService.findOne(id);

      if (!deal) {
        return next(notFound());
      }

      const dealObj = { id, updatedBy: req.session.currentUser.id };
      await dealsService.active(dealObj);

      req.flash("info", "Deal is activated.");
      return res.redirect(`/deals/${id}`);
    } catch (err) {
      next(err);
    }
  },
};
