const express = require("express");
const tasksController = require("../controllers/tasks-controller");
const taskCommentsController = require("../controllers/task-comments-controller");

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

router.post("/:id/comments", taskCommentsController.create);
router.delete("/:taskId/comments/:id", taskCommentsController.destroy);

module.exports = router;
