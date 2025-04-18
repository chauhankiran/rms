const express = require("express");
const quotesController = require("../controllers/quotes-controller");
const quoteCommentsController = require("../controllers/quote-comments-controller");
const quoteFilesController = require("../controllers/quote-files-controller");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.get("/", quotesController.index);
router.get("/new", quotesController.new);
router.post("/", quotesController.create);
router.get("/:id", quotesController.show);
router.get("/:id/edit", quotesController.edit);
router.put("/:id", quotesController.update);
router.delete("/:id", quotesController.destroy);
router.put("/:id/archive", quotesController.archive);
router.put("/:id/active", quotesController.active);

router.post("/:id/comments", quoteCommentsController.create);
router.delete("/:quoteId/comments/:id", quoteCommentsController.destroy);

router.post(
    "/:id/files",
    upload.single("displayName"),
    quoteFilesController.create
);
router.delete("/:quoteId/files/:id", quoteFilesController.destroy);
router.get("/:quoteId/files/:id", quoteFilesController.download);

router.post("/views/fields", quotesController.viewFields);

module.exports = router;
