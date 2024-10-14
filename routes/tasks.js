const express = require("express");
const tasksController = require("../controllers/tasks-controller");

const router = express.Router();

router.get("/", tasksController.index);
router.get("/new", tasksController.new);
router.post("/", tasksController.create);
router.get("/:id", tasksController.show);
router.get("/:id/edit", tasksController.edit);
router.put("/:id", tasksController.update);
router.delete("/:id", tasksController.destroy);
router.put("/:id/archive", tasksController.archive);
router.put("/:id/active", tasksController.active);

module.exports = router;
