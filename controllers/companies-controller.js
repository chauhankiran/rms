const companiesService = require("../services/companies-service");
const contactsService = require("../services/contacts-service");
const companyViewsService = require("../services/company-views-service");
const companySourcesService = require("../services/admin/company-sources-service");
const generatePaginationLinks = require("../helpers/generate-pagination-links");

const columnsObj = {
  id: "c.id",
  name: "c.name",
  companySourceId: 'cs.name AS "companySource"',
  createdBy: 'creator.email AS "createdByEmail"',
  createdAt: 'c."createdAt"',
  updatedBy: 'updater.email AS "updatedByEmail"',
  updatedAt: 'c."updatedAt"',
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
      const companyViews = await companyViewsService.pluck(["name"]);

      let columns = 'c."isActive",';
      let headers = [];
      for (const companyView of companyViews) {
        const column = columnsObj[companyView.name];
        if (column) {
          columns += `${column},`;
          headers.push(companyView.name);
        }
      }

      // TEMP: Track the issue
      // https://github.com/porsager/postgres/issues/894
      columns = columns.endsWith(",") ? columns.slice(0, -1) : columns;

      const optionsObj = { search, limit, skip, orderBy, orderDir, columns };
      const companies = await companiesService.find(optionsObj);
      const { count } = await companiesService.count(optionsObj);

      const pages = Math.ceil(count / limit);

      const paginationLinks = generatePaginationLinks({
        link: "/companies",
        page,
        pages,
        search,
        limit,
        orderBy,
        orderDir,
      });

      return res.render("companies/index", {
        title: "Companies",
        companies,
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
      const companySources = await companySourcesService.pluck(["id", "name"]);

      return res.render("companies/new", {
        title: "New company",
        companySources,
      });
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    const { name, employeeSize, description, companySourceId } = req.body;

    if (!name) {
      req.flash("error", "Name is required.");
      res.redirect(`/companies/new`);
      return;
    }

    try {
      const companyObj = {
        name,
        employeeSize,
        description,
        companySourceId,
        createdBy: req.session.currentUser.id,
      };
      await companiesService.create(companyObj);

      req.flash("info", "Company is created.");
      res.redirect("/companies");
      return;
    } catch (err) {
      next(err);
    }
  },

  show: async (req, res, next) => {
    const id = req.params.id;

    try {
      const company = await companiesService.findOne(id);

      if (!company) {
        req.flash("error", "Company not found.");
        res.redirect("/companies");
        return;
      }

      const optionsObj = {
        skip: 0,
        limit: 100,
        orderBy: "id",
        orderDir: "DESC",
        companyId: company.id,
      };
      const contacts = await contactsService.find(optionsObj);

      return res.render("companies/show", {
        title: "Show company",
        company,
        contacts,
      });
    } catch (err) {
      next(err);
    }
  },

  edit: async (req, res, next) => {
    const id = req.params.id;

    try {
      const company = await companiesService.findOne(id);

      if (!company) {
        req.flash("error", "Company not found.");
        res.redirect("/companies");
        return;
      }

      const companySources = await companySourcesService.pluck(["id", "name"]);

      return res.render("companies/edit", {
        title: "Edit company",
        company,
        companySources,
      });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    const id = req.params.id;
    const { name, employeeSize, description, companySourceId } = req.body;

    if (!name) {
      req.flash("error", "Name is required.");
      res.redirect(`/companies/${id}/edit`);
      return;
    }

    try {
      const company = await companiesService.findOne(id);

      if (!company) {
        req.flash("error", "Company not found.");
        res.redirect("/companies");
        return;
      }

      const companyObj = {
        id,
        name,
        employeeSize,
        description,
        companySourceId,
        updatedBy: req.session.currentUser.id,
      };
      await companiesService.update(companyObj);

      req.flash("info", "Company is updated.");
      res.redirect(`/companies/${id}`);
    } catch (err) {
      next(err);
    }
  },

  destroy: async (req, res, next) => {
    const id = req.params.id;

    try {
      const company = await companiesService.findOne(id);

      if (!company) {
        req.flash("error", "Company not found.");
        res.redirect("/companies");
        return;
      }

      await companiesService.destroy(id);

      req.flash("info", "Company is deleted.");
      res.redirect("/companies");
    } catch (err) {
      next(err);
    }
  },

  archive: async (req, res, next) => {
    const id = req.params.id;

    try {
      const company = await companiesService.findOne(id);

      if (!company) {
        req.flash("error", "Company not found.");
        res.redirect("/companies");
        return;
      }

      const companyObj = { id, updatedBy: req.session.currentUser.id };
      await companiesService.archive(companyObj);

      req.flash("info", "Company is archived.");
      res.redirect(`/companies/${id}`);
    } catch (err) {
      next(err);
    }
  },

  active: async (req, res, next) => {
    const id = req.params.id;

    try {
      const company = await companiesService.findOne(id);

      if (!company) {
        req.flash("error", "Company not found.");
        res.redirect("/companies");
        return;
      }

      const companyObj = { id, updatedBy: req.session.currentUser.id };
      await companiesService.active(companyObj);

      req.flash("info", "Company is activated.");
      res.redirect(`/companies/${id}`);
    } catch (err) {
      next(err);
    }
  },
};
