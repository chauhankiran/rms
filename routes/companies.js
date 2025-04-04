const express = require("express");
const companiesController = require("../controllers/companies-controller");

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

module.exports = router;
