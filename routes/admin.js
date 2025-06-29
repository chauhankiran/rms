const express = require("express");
const adminController = require("../controllers/admin/admin-controller");
const usersController = require("../controllers/admin/users-controller");
const refsController = require("../controllers/admin/refs-controller");

const companyLabelsController = require("../controllers/admin/company-labels-controller");
const contactLabelsController = require("../controllers/admin/contact-labels-controller");
const dealLabelsController = require("../controllers/admin/deal-labels-controller");
const quoteLabelsController = require("../controllers/admin/quote-labels-controller");
const ticketLabelsController = require("../controllers/admin/ticket-labels-controller");
const taskLabelsController = require("../controllers/admin/task-labels-controller");
const moduleLabelsController = require("../controllers/admin/module-labels-controller");

const checkRef = require("../middleware/check-ref");

const router = express.Router();

router.get("/", adminController.index);
router.get("/refs", adminController.refs);

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
 * Refs.
 */
router.get("/refs/:ref", checkRef, refsController.index);
router.get("/refs/:ref/new", checkRef, refsController.new);
router.post("/refs/:ref", checkRef, refsController.create);
router.get("/refs/:ref/:id", checkRef, refsController.show);
router.get("/refs/:ref/:id/edit", checkRef, refsController.edit);
router.put("/refs/:ref/:id", checkRef, refsController.update);
router.delete("/refs/:ref/:id", checkRef, refsController.destroy);
router.put("/refs/:ref/:id/archive", checkRef, refsController.archive);
router.put("/refs/:ref/:id/active", checkRef, refsController.active);

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
