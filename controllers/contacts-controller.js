const contactsService = require("../services/contacts-service");
const contactIndustriesService = require("../services/admin/contact-industries-service");
const getPagination = require("../helpers/get-pagination");

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
      const contacts = await contactsService.find(optionsObj);
      const { count } = await contactsService.count(optionsObj);

      const pages = Math.ceil(count / limit);

      const pagination = getPagination({
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
        pagination,
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
    try {
      const contactIndustries = await contactIndustriesService.pluck([
        "id",
        "name",
      ]);

      return res.render("contacts/new", {
        title: "New contact",
        contactIndustries,
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
      const contact = await contactsService.findOne(id);

      if (!contact) {
        req.flash("error", "Contact not found.");
        res.redirect("/contacts");
        return;
      }

      return res.render("contacts/show", { title: "Show contact", contact });
    } catch (err) {
      next(err);
    }
  },

  edit: async (req, res, next) => {
    const id = req.params.id;

    try {
      const contact = await contactsService.findOne(id);

      if (!contact) {
        req.flash("error", "Contact not found.");
        res.redirect("/contacts");
        return;
      }

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
      const contact = await contactsService.findOne(id);

      if (!contact) {
        req.flash("error", "Contact not found.");
        res.redirect("/contacts");
        return;
      }

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
      const contact = await contactsService.findOne(id);

      if (!contact) {
        req.flash("error", "Contact not found.");
        res.redirect("/contacts");
        return;
      }

      await contactsService.destroy(id);

      req.flash("info", "Contact is deleted.");
      res.redirect("/contacts");
    } catch (err) {
      next(err);
    }
  },

  archive: async (req, res, next) => {
    const id = req.params.id;

    try {
      const contact = await contactsService.findOne(id);

      if (!contact) {
        req.flash("error", "Contact not found.");
        res.redirect("/contacts");
        return;
      }

      const contactObj = { id, updatedBy: req.session.currentUser.id };
      await contactsService.archive(contactObj);

      req.flash("info", "Contact is archived.");
      res.redirect(`/contacts/${id}`);
    } catch (err) {
      next(err);
    }
  },

  active: async (req, res, next) => {
    const id = req.params.id;

    try {
      const contact = await contactsService.findOne(id);

      if (!contact) {
        req.flash("error", "Contact not found.");
        res.redirect("/contacts");
        return;
      }

      const contactObj = { id, updatedBy: req.session.currentUser.id };
      await contactsService.active(contactObj);

      req.flash("info", "Contact is activated.");
      res.redirect(`/contacts/${id}`);
    } catch (err) {
      next(err);
    }
  },
};
