const express = require("express");
const companiesController = require("../controllers/companies-controller");
const companyCommentsController = require("../controllers/company-comments-controller");

const router = express.Router();

router.get("/", companiesController.index);
router.get("/new", companiesController.new);
router.post("/", companiesController.create);
router.get("/:id", companiesController.show);
router.get("/:id/edit", companiesController.edit);
router.put("/:id", companiesController.update);
router.delete("/:id", companiesController.destroy);
router.put("/:id/archive", companiesController.archive);
router.put("/:id/active", companiesController.active);

router.post("/:id/comments", companyCommentsController.create);
router.delete("/:companyId/comments/:id", companyCommentsController.destroy);

module.exports = router;
