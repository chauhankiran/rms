const createError = require("http-errors");
const quotesService = require("../services/quotes-service");
const quoteViewsService = require("../services/quote-views-service");
const generatePaginationLinks = require("../helpers/generate-pagination-links");

const columnsObj = {
  id: "q.id",
  name: "q.name",
  total: "q.total",
  createdBy: 'creator.email AS "createdByEmail"',
  createdAt: 'q."createdAt"',
  updatedBy: 'updater.email AS "updatedByEmail"',
  updatedAt: 'q."updatedAt"',
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
      const quoteViews = await quoteViewsService.pluck(["name"]);

      let columns = 'q."isActive",';
      let headers = [];
      for (const quoteView of quoteViews) {
        const column = columnsObj[quoteView.name];
        if (column) {
          columns += `${column},`;
          headers.push(quoteView.name);
        }
      }

      // TEMP: Track the issue
      // https://github.com/porsager/postgres/issues/894
      columns = columns.endsWith(",") ? columns.slice(0, -1) : columns;

      const optionsObj = { search, limit, skip, orderBy, orderDir, columns };
      const quotes = await quotesService.find(optionsObj);
      const { count } = await quotesService.count(optionsObj);

      const pages = Math.ceil(count / limit);

      const paginationLinks = generatePaginationLinks({
        link: "/quotes",
        page,
        pages,
        search,
        limit,
        orderBy,
        orderDir,
      });

      return res.render("quotes/index", {
        title: "Quotes",
        quotes,
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
    return res.render("quotes/new", {
      title: "New quote",
    });
  },

  create: async (req, res, next) => {
    const { name, total, description, companyId, contactId, dealId } = req.body;

    if (!name) {
      req.flash("error", "Name is required.");
      res.redirect(`/quotes/new`);
      return;
    }

    try {
      const quoteObj = {
        name,
        total,
        description,
        companyId: companyId || null,
        contactId: contactId || null,
        dealId: dealId || null,
        createdBy: req.session.currentUser.id,
      };
      await quotesService.create(quoteObj);

      req.flash("info", "Quote is created.");
      res.redirect("/quotes");
      return;
    } catch (err) {
      next(err);
    }
  },

  show: async (req, res, next) => {
    const id = req.params.id;

    try {
      const quote = await quotesService.findOne(id);

      if (!quote) {
        return next(createError(404));
      }

      return res.render("quotes/show", {
        title: "Show quote",
        quote,
      });
    } catch (err) {
      next(err);
    }
  },

  edit: async (req, res, next) => {
    const id = req.params.id;

    try {
      const quote = await quotesService.findOne(id);

      if (!quote) {
        return next(createError(404));
      }

      return res.render("quotes/edit", {
        title: "Edit quote",
        quote,
      });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    const id = req.params.id;
    const { name, total, description } = req.body;

    if (!name) {
      req.flash("error", "Name is required.");
      res.redirect(`/quotes/${id}/edit`);
      return;
    }

    try {
      const quote = await quotesService.findOne(id);

      if (!quote) {
        return next(createError(404));
      }

      const quoteObj = {
        id,
        name,
        total,
        description,
        updatedBy: req.session.currentUser.id,
      };
      await quotesService.update(quoteObj);

      req.flash("info", "Quote is updated.");
      res.redirect(`/quotes/${id}`);
    } catch (err) {
      next(err);
    }
  },

  destroy: async (req, res, next) => {
    const id = req.params.id;

    try {
      const quote = await quotesService.findOne(id);

      if (!quote) {
        return next(createError(404));
      }

      await quotesService.destroy(id);

      req.flash("info", "Quote is deleted.");
      res.redirect("/quotes");
    } catch (err) {
      next(err);
    }
  },

  archive: async (req, res, next) => {
    const id = req.params.id;

    try {
      const quote = await quotesService.findOne(id);

      if (!quote) {
        return next(createError(404));
      }

      const quoteObj = { id, updatedBy: req.session.currentUser.id };
      await quotesService.archive(quoteObj);

      req.flash("info", "Quote is archived.");
      res.redirect(`/quotes/${id}`);
    } catch (err) {
      next(err);
    }
  },

  active: async (req, res, next) => {
    const id = req.params.id;

    try {
      const quote = await quotesService.findOne(id);

      if (!quote) {
        return next(createError(404));
      }

      const quoteObj = { id, updatedBy: req.session.currentUser.id };
      await quotesService.active(quoteObj);

      req.flash("info", "Quote is activated.");
      res.redirect(`/quotes/${id}`);
    } catch (err) {
      next(err);
    }
  },
};
