const express = require("express");

const companiesController = require("../controllers/companies-controller");
const isExists = require("../middleware/is-exists");
const router = express.Router();

router.get("/", companiesController.index);
router.get("/new", companiesController.new);
router.post("/create", companiesController.create);
router.get("/:id", isExists("companies"), companiesController.show);
router.get("/:id/edit", isExists("companies"), companiesController.edit);
router.put("/:id/update", isExists("companies"), companiesController.update);
router.delete("/:id", isExists("companies"), companiesController.destroy);
router.put("/:id/archive", isExists("companies"), companiesController.archive);
router.put("/:id/active", isExists("companies"), companiesController.active);

module.exports = router;
