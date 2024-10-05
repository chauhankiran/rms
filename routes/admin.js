const express = require("express");
const adminController = require("../controllers/admin/admin-controller");
const usersController = require("../controllers/admin/users-controller");
const companySourcesController = require("../controllers/admin/company-sources-controller");
const contactIndustriesController = require("../controllers/admin/contact-industries-controller");

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

module.exports = router;
