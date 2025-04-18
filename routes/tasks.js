const express = require("express");
const tasksController = require("../controllers/tasks-controller");
const taskCommentsController = require("../controllers/task-comments-controller");
const taskFilesController = require("../controllers/task-files-controller");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

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

router.post(
    "/:id/files",
    upload.single("displayName"),
    taskFilesController.create
);
router.delete("/:taskId/files/:id", taskFilesController.destroy);
router.get("/:taskId/files/:id", taskFilesController.download);

router.post("/views/fields", tasksController.viewFields);

module.exports = router;
