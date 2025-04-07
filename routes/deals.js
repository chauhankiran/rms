const express = require("express");
const dealsController = require("../controllers/deals-controller");
const dealCommentsController = require("../controllers/deal-comments-controller");

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

router.post("/:id/comments", dealCommentsController.create);

module.exports = router;
