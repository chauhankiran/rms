const express = require("express");
const companySourcesController = require("../controllers/admin/company-sources-controller");
const contactIndustriesController = require("../controllers/admin/contact-industries-controller");

const router = express.Router();

router.get("/company-sources", companySourcesController.index);
router.get("/company-sources/new", companySourcesController.new);
router.post("/company-sources/", companySourcesController.create);
router.get("/company-sources/:id", companySourcesController.show);
router.get("/company-sources/:id/edit", companySourcesController.edit);
router.put("/company-sources/:id", companySourcesController.update);
router.delete("/company-sources/:id", companySourcesController.destroy);
router.put("/company-sources/:id/archive", companySourcesController.archive);

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

module.exports = router;
