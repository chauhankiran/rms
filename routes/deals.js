const express = require("express");
const dealsController = require("../controllers/deals-controller");
const dealCommentsController = require("../controllers/deal-comments-controller");
const dealFilesController = require("../controllers/deal-files-controller");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const checkExists = require("../middleware/check-exists");

const router = express.Router();

router.get("/", dealsController.index);
router.get("/view", dealsController.showView); // change view
router.put("/view", dealsController.view); // change view
router.get("/new", dealsController.new);
router.post("/", dealsController.create);
router.get("/:id", dealsController.show);
router.get("/:id/edit", dealsController.edit);
router.put("/:id", checkExists("deals"), dealsController.update);
router.delete("/:id", checkExists("deals"), dealsController.destroy);
router.put("/:id/archive", checkExists("deals"), dealsController.archive);
router.put("/:id/active", checkExists("deals"), dealsController.active);

router.post("/:id/comments", dealCommentsController.create);
router.delete("/:dealId/comments/:id", dealCommentsController.destroy);

router.post("/:id/files", upload.single("displayName"), dealFilesController.create);
router.delete("/:dealId/files/:id", dealFilesController.destroy);
router.get("/:dealId/files/:id", dealFilesController.download);

module.exports = router;
