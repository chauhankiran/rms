const contactsService = require("../services/contacts-service");
const contactIndustriesService = require("../services/admin/contact-industries-service");
const generatePaginationLinks = require("../helpers/generate-pagination-links");
const sql = require("../db/sql");

const handleContact = async (id, req, res) => {
  const contact = await contactsService.findOne(id);

  if (!contact) {
    req.flash("error", "Contact not found.");
    res.redirect("/contacts");
    return;
  }

  return contact;
};

const updateContactStatus = async (req, res, next, action, message) => {
  const id = req.params.id;

  try {
    await handleContact(id, req, res);

    const contactObj = { id, updatedBy: req.session.currentUser.id };
    await contactsService[action](contactObj);

    req.flash("info", message);
    res.redirect(`/contacts/${id}`);
    return;
  } catch (err) {
    next(err);
  }
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
      const contactViews = await sql`
        SELECT
          name
        FROM
          "contactViews"
      `;

      let columns = 'c."isActive",';
      let headers = [];
      for (const contactView of contactViews) {
        // id
        if (contactView.name === "id") {
          columns += "c.id,";
          headers.push("id");
        }

        // name
        if (contactView.name === "name") {
          columns += "c.name,";
          headers.push("name");
        }

        // contactIndustryId
        if (contactView.name === "contactIndustryId") {
          columns += 'cs.name AS "contactIndustry",';
          headers.push("contactIndustryId");
        }

        // updatedBy
        if (contactView.name === "updatedBy") {
          columns += 'creator."updatedBy" AS "updatedByEmail",';
          headers.push("updatedBy");
        }

        // updatedAt
        if (contactView.name === "updatedAt") {
          columns += 'c."updatedAt",';
          headers.push("updatedAt");
        }
      }

      // TEMP: Track the issue
      // https://github.com/porsager/postgres/issues/894
      if (columns.length > 0 && columns.slice(-1) === ",") {
        columns = columns.slice(0, -1);
      }

      const optionsObj = { search, limit, skip, orderBy, orderDir, columns };
      const contacts = await contactsService.find(optionsObj);
      const { count } = await contactsService.count(optionsObj);

      const pages = Math.ceil(count / limit);

      const paginationLinks = generatePaginationLinks({
        link: "/contacts",
        page,
        pages,
        search,
        limit,
        orderBy,
        orderDir,
      });

      return res.render("contacts/index", {
        title: "Contacts",
        contacts,
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

    try {
      const contactIndustries = await contactIndustriesService.pluck([
        "id",
        "name",
      ]);

      return res.render("contacts/new", {
        title: "New contact",
        contactIndustries,
        companyId,
      });
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    const {
      prefix,
      firstName,
      lastName,
      annualRevenue,
      description,
      contactIndustryId,
      companyId,
    } = req.body;

    if (!firstName) {
      req.flash("error", "First name is required.");
      res.redirect(`/contacts/new`);
      return;
    }

    if (!lastName) {
      req.flash("error", "Last name is required.");
      res.redirect(`/contacts/new`);
      return;
    }

    try {
      const contactObj = {
        prefix,
        firstName,
        lastName,
        annualRevenue,
        description,
        contactIndustryId,
        companyId: companyId || null,
        createdBy: req.session.currentUser.id,
      };
      await contactsService.create(contactObj);

      req.flash("info", "Contact is created.");
      res.redirect("/contacts");
      return;
    } catch (err) {
      next(err);
    }
  },

  show: async (req, res, next) => {
    const id = req.params.id;

    try {
      const contact = await handleContact(id, req, res);

      return res.render("contacts/show", { title: "Show contact", contact });
    } catch (err) {
      next(err);
    }
  },

  edit: async (req, res, next) => {
    const id = req.params.id;

    try {
      const contact = await handleContact(id, req, res);

      const contactIndustries = await contactIndustriesService.pluck([
        "id",
        "name",
      ]);

      return res.render("contacts/edit", {
        title: "Edit contact",
        contact,
        contactIndustries,
      });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    const id = req.params.id;
    const {
      prefix,
      firstName,
      lastName,
      annualRevenue,
      description,
      contactIndustryId,
    } = req.body;

    if (!firstName) {
      req.flash("error", "First name is required.");
      res.redirect(`/contacts/${id}/edit`);
      return;
    }

    if (!lastName) {
      req.flash("error", "Last name is required.");
      res.redirect(`/contacts/${id}/edit`);
      return;
    }

    try {
      await handleContact(id, req, res);

      const contactObj = {
        id,
        prefix,
        firstName,
        lastName,
        annualRevenue,
        description,
        contactIndustryId,
        updatedBy: req.session.currentUser.id,
      };
      await contactsService.update(contactObj);

      req.flash("info", "Contact is updated.");
      res.redirect(`/contacts/${id}`);
    } catch (err) {
      next(err);
    }
  },

  destroy: async (req, res, next) => {
    const id = req.params.id;

    try {
      await handleContact(id, req, res);

      await contactsService.destroy(id);

      req.flash("info", "Contact is deleted.");
      res.redirect("/contacts");
    } catch (err) {
      next(err);
    }
  },

  archive: async (req, res, next) => {
    await updateContactStatus(
      req,
      res,
      next,
      "archive",
      "Contact is archived.",
    );
  },

  active: async (req, res, next) => {
    await updateContactStatus(
      req,
      res,
      next,
      "active",
      "Contact is activated.",
    );
  },
};
