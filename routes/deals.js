const express = require("express");
const dealsController = require("../controllers/deals-controller");

const router = express.Router();

router.get("/", dealsController.index);
router.get("/new", dealsController.new);
router.post("/", dealsController.create);
router.get("/:id", dealsController.show);
router.get("/:id/edit", dealsController.edit);
router.put("/:id", dealsController.update);
router.delete("/:id", dealsController.destroy);
router.put("/:id/archive", dealsController.archive);
router.put("/:id/active", dealsController.active);

module.exports = router;
