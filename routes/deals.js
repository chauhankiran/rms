const express = require("express");
const dealsController = require("../controllers/deals-controller");
const dealCommentsController = require("../controllers/deal-comments-controller");
const dealFilesController = require("../controllers/deal-files-controller");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.get("/", dealsController.index);
router.get("/view", dealsController.showView); // change view
router.put("/view", dealsController.view); // change view
router.get("/new", dealsController.new);
router.post("/", dealsController.create);
router.get("/:id", dealsController.show);
router.get("/:id/edit", dealsController.edit);
router.put("/:id", dealsController.update);
router.delete("/:id", dealsController.destroy);
router.put("/:id/archive", dealsController.archive);
router.put("/:id/active", dealsController.active);

router.post("/:id/comments", dealCommentsController.create);
router.delete("/:dealId/comments/:id", dealCommentsController.destroy);

router.post(
    "/:id/files",
    upload.single("displayName"),
    dealFilesController.create
);
router.delete("/:dealId/files/:id", dealFilesController.destroy);
router.get("/:dealId/files/:id", dealFilesController.download);

module.exports = router;
