const express = require("express");
const adminController = require("../controllers/admin/admin-controller");
const usersController = require("../controllers/admin/users-controller");
const companySourcesController = require("../controllers/admin/company-sources-controller");
const contactIndustriesController = require("../controllers/admin/contact-industries-controller");
const dealSourcesController = require("../controllers/admin/deal-sources-controller");
const ticketTypesController = require("../controllers/admin/ticket-types-controller");
const taskTypesController = require("../controllers/admin/task-types-controller");
const sourcesController = require("../controllers/admin/sources-controller");
const statusesController = require("../controllers/admin/statuses-controller");
const stagesController = require("../controllers/admin/stages-controller");
const industriesController = require("../controllers/admin/industries-controller");
const countriesController = require("../controllers/admin/countries-controller");
const statesController = require("../controllers/admin/states-controller");
const typesController = require("../controllers/admin/types-controller");

const companyLabelsController = require("../controllers/admin/company-labels-controller");
const contactLabelsController = require("../controllers/admin/contact-labels-controller");
const dealLabelsController = require("../controllers/admin/deal-labels-controller");
const quoteLabelsController = require("../controllers/admin/quote-labels-controller");
const ticketLabelsController = require("../controllers/admin/ticket-labels-controller");
const taskLabelsController = require("../controllers/admin/task-labels-controller");
const moduleLabelsController = require("../controllers/admin/module-labels-controller");

const router = express.Router();

router.get("/", adminController.index);

/**
 * Users
 */
router.get("/users", usersController.index);
router.get("/users/new", usersController.new);
router.post("/users", usersController.create);
router.get("/users/:id", usersController.show);
router.get("/users/:id/edit", usersController.edit);
router.put("/users/:id", usersController.update);
router.delete("/users/:id", usersController.destroy);
router.put("/users/:id/archive", usersController.archive);
router.put("/users/mass-actions/active", usersController.massActionsActive);
router.put("/users/mass-actions/deactive", usersController.massActionsDeActive);
router.delete("/users/mass-actions/delete", usersController.massActionsDelete);

/**
 * Ref. Table: Company sources
 */
router.get("/company-sources", companySourcesController.index);
router.get("/company-sources/new", companySourcesController.new);
router.post("/company-sources/", companySourcesController.create);
router.get("/company-sources/:id", companySourcesController.show);
router.get("/company-sources/:id/edit", companySourcesController.edit);
router.put("/company-sources/:id", companySourcesController.update);
router.delete("/company-sources/:id", companySourcesController.destroy);
router.put("/company-sources/:id/archive", companySourcesController.archive);
router.put("/company-sources/:id/active", companySourcesController.active);

/**
 * Ref. Table: Contact industries
 */
router.get("/contact-industries", contactIndustriesController.index);
router.get("/contact-industries/new", contactIndustriesController.new);
router.post("/contact-industries/", contactIndustriesController.create);
router.get("/contact-industries/:id", contactIndustriesController.show);
router.get("/contact-industries/:id/edit", contactIndustriesController.edit);
router.put("/contact-industries/:id", contactIndustriesController.update);
router.delete("/contact-industries/:id", contactIndustriesController.destroy);
router.put(
    "/contact-industries/:id/archive",
    contactIndustriesController.archive
);
router.put(
    "/contact-industries/:id/active",
    contactIndustriesController.active
);

/**
 * Ref. Table: Deal sources
 */
router.get("/deal-sources", dealSourcesController.index);
router.get("/deal-sources/new", dealSourcesController.new);
router.post("/deal-sources/", dealSourcesController.create);
router.get("/deal-sources/:id", dealSourcesController.show);
router.get("/deal-sources/:id/edit", dealSourcesController.edit);
router.put("/deal-sources/:id", dealSourcesController.update);
router.delete("/deal-sources/:id", dealSourcesController.destroy);
router.put("/deal-sources/:id/archive", dealSourcesController.archive);
router.put("/deal-sources/:id/active", dealSourcesController.active);

/**
 * Ref. Table: Ticket types
 */
router.get("/ticket-types", ticketTypesController.index);
router.get("/ticket-types/new", ticketTypesController.new);
router.post("/ticket-types/", ticketTypesController.create);
router.get("/ticket-types/:id", ticketTypesController.show);
router.get("/ticket-types/:id/edit", ticketTypesController.edit);
router.put("/ticket-types/:id", ticketTypesController.update);
router.delete("/ticket-types/:id", ticketTypesController.destroy);
router.put("/ticket-types/:id/archive", ticketTypesController.archive);
router.put("/ticket-types/:id/active", ticketTypesController.active);

/**
 * Ref. Table: Task types
 */
router.get("/task-types", taskTypesController.index);
router.get("/task-types/new", taskTypesController.new);
router.post("/task-types", taskTypesController.create);
router.get("/task-types/:id", taskTypesController.show);
router.get("/task-types/:id/edit", taskTypesController.edit);
router.put("/task-types/:id", taskTypesController.update);
router.delete("/task-types/:id", taskTypesController.destroy);
router.put("/task-types/:id/archive", taskTypesController.archive);
router.put("/task-types/:id/active", taskTypesController.active);

/**
 * Ref. Table: Sources
 */
router.get("/sources", sourcesController.index);
router.get("/sources/new", sourcesController.new);
router.post("/sources", sourcesController.create);
router.get("/sources/:id", sourcesController.show);
router.get("/sources/:id/edit", sourcesController.edit);
router.put("/sources/:id", sourcesController.update);
router.delete("/sources/:id", sourcesController.destroy);
router.put("/sources/:id/archive", sourcesController.archive);
router.put("/sources/:id/active", sourcesController.active);

/**
 * Ref. Table: Statues
 */
router.get("/statuses", statusesController.index);
router.get("/statuses/new", statusesController.new);
router.post("/statuses", statusesController.create);
router.get("/statuses/:id", statusesController.show);
router.get("/statuses/:id/edit", statusesController.edit);
router.put("/statuses/:id", statusesController.update);
router.delete("/statuses/:id", statusesController.destroy);
router.put("/statuses/:id/archive", statusesController.archive);
router.put("/statuses/:id/active", statusesController.active);

/**
 * Ref. Table: Stages
 */
router.get("/stages", stagesController.index);
router.get("/stages/new", stagesController.new);
router.post("/stages", stagesController.create);
router.get("/stages/:id", stagesController.show);
router.get("/stages/:id/edit", stagesController.edit);
router.put("/stages/:id", stagesController.update);
router.delete("/stages/:id", stagesController.destroy);
router.put("/stages/:id/archive", stagesController.archive);
router.put("/stages/:id/active", stagesController.active);

/**
 * Ref. Table: Industries
 */
router.get("/industries", industriesController.index);
router.get("/industries/new", industriesController.new);
router.post("/industries", industriesController.create);
router.get("/industries/:id", industriesController.show);
router.get("/industries/:id/edit", industriesController.edit);
router.put("/industries/:id", industriesController.update);
router.delete("/industries/:id", industriesController.destroy);
router.put("/industries/:id/archive", industriesController.archive);
router.put("/industries/:id/active", industriesController.active);

/**
 * Ref. Table: Countries
 */
router.get("/countries", countriesController.index);
router.get("/countries/new", countriesController.new);
router.post("/countries", countriesController.create);
router.get("/countries/:id", countriesController.show);
router.get("/countries/:id/edit", countriesController.edit);
router.put("/countries/:id", countriesController.update);
router.delete("/countries/:id", countriesController.destroy);
router.put("/countries/:id/archive", countriesController.archive);
router.put("/countries/:id/active", countriesController.active);

/**
 * Ref. Table: States
 */
router.get("/states", statesController.index);
router.get("/states/new", statesController.new);
router.post("/states", statesController.create);
router.get("/states/:id", statesController.show);
router.get("/states/:id/edit", statesController.edit);
router.put("/states/:id", statesController.update);
router.delete("/states/:id", statesController.destroy);
router.put("/states/:id/archive", statesController.archive);
router.put("/states/:id/active", statesController.active);

/**
 * Ref. Table: Types
 */
router.get("/types", typesController.index);
router.get("/types/new", typesController.new);
router.post("/types", typesController.create);
router.get("/types/:id", typesController.show);
router.get("/types/:id/edit", typesController.edit);
router.put("/types/:id", typesController.update);
router.delete("/types/:id", typesController.destroy);
router.put("/types/:id/archive", typesController.archive);
router.put("/types/:id/active", typesController.active);

/**
 * Company labels
 */
router.get("/labels/companies", companyLabelsController.index);
router.get("/labels/companies/:id", companyLabelsController.show);
router.get("/labels/companies/:id/edit", companyLabelsController.edit);
router.put("/labels/companies/:id", companyLabelsController.update);
router.put("/labels/companies/:id/archive", companyLabelsController.archive);
router.put("/labels/companies/:id/active", companyLabelsController.active);

/**
 * Contact labels
 */
router.get("/labels/contacts", contactLabelsController.index);
router.get("/labels/contacts/:id", contactLabelsController.show);
router.get("/labels/contacts/:id/edit", contactLabelsController.edit);
router.put("/labels/contacts/:id", contactLabelsController.update);
router.put("/labels/contacts/:id/archive", contactLabelsController.archive);
router.put("/labels/contacts/:id/active", contactLabelsController.active);

/**
 * Deal labels
 */
router.get("/labels/deals", dealLabelsController.index);
router.get("/labels/deals/:id", dealLabelsController.show);
router.get("/labels/deals/:id/edit", dealLabelsController.edit);
router.put("/labels/deals/:id", dealLabelsController.update);
router.put("/labels/deals/:id/archive", dealLabelsController.archive);
router.put("/labels/deals/:id/active", dealLabelsController.active);

/**
 * Quote labels
 */
router.get("/labels/quotes", quoteLabelsController.index);
router.get("/labels/quotes/:id", quoteLabelsController.show);
router.get("/labels/quotes/:id/edit", quoteLabelsController.edit);
router.put("/labels/quotes/:id", quoteLabelsController.update);
router.put("/labels/quotes/:id/archive", quoteLabelsController.archive);
router.put("/labels/quotes/:id/active", quoteLabelsController.active);

/**
 * Ticket labels
 */
router.get("/labels/tickets", ticketLabelsController.index);
router.get("/labels/tickets/:id", ticketLabelsController.show);
router.get("/labels/tickets/:id/edit", ticketLabelsController.edit);
router.put("/labels/tickets/:id", ticketLabelsController.update);
router.put("/labels/tickets/:id/archive", ticketLabelsController.archive);
router.put("/labels/tickets/:id/active", ticketLabelsController.active);

/**
 * Task labels
 */
router.get("/labels/tasks", taskLabelsController.index);
router.get("/labels/tasks/:id", taskLabelsController.show);
router.get("/labels/tasks/:id/edit", taskLabelsController.edit);
router.put("/labels/tasks/:id", taskLabelsController.update);
router.put("/labels/tasks/:id/archive", taskLabelsController.archive);
router.put("/labels/tasks/:id/active", taskLabelsController.active);

/**
 * Module labels
 */
router.get("/labels/modules", moduleLabelsController.index);
router.get("/labels/modules/:id", moduleLabelsController.show);
router.get("/labels/modules/:id/edit", moduleLabelsController.edit);
router.put("/labels/modules/:id", moduleLabelsController.update);
router.put("/labels/modules/:id/archive", moduleLabelsController.archive);
router.put("/labels/modules/:id/active", moduleLabelsController.active);

module.exports = router;
