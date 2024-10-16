const express = require("express");
const adminController = require("../controllers/admin/admin-controller");
const usersController = require("../controllers/admin/users-controller");
const companySourcesController = require("../controllers/admin/company-sources-controller");
const contactIndustriesController = require("../controllers/admin/contact-industries-controller");
const dealSourcesController = require("../controllers/admin/deal-sources-controller");
const ticketTypesController = require("../controllers/admin/ticket-types-controller");
const taskTypesController = require("../controllers/admin/task-types-controller");

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
 * Company sources
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
 * Contact industries
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
  contactIndustriesController.archive,
);
router.put(
  "/contact-industries/:id/active",
  contactIndustriesController.active,
);

/**
 * Deal sources
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
 * Ticket types
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
 * Task types
 */
router.get("/task-types", taskTypesController.index);
router.get("/task-types/new", taskTypesController.new);
router.post("/task-types/", taskTypesController.create);
router.get("/task-types/:id", taskTypesController.show);
router.get("/task-types/:id/edit", taskTypesController.edit);
router.put("/task-types/:id", taskTypesController.update);
router.delete("/task-types/:id", taskTypesController.destroy);
router.put("/task-types/:id/archive", taskTypesController.archive);
router.put("/task-types/:id/active", taskTypesController.active);

module.exports = router;
