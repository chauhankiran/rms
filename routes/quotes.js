const express = require("express");
const quotesController = require("../controllers/quotes-controller");
const quoteCommentsController = require("../controllers/quote-comments-controller");
const quoteFilesController = require("../controllers/quote-files-controller");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const checkExists = require("../middleware/check-exists");

const router = express.Router();

router.get("/", quotesController.index);
router.get("/view", quotesController.showView); // change view
router.put("/view", quotesController.view); // change view
router.get("/new", quotesController.new);
router.post("/", quotesController.create);
router.get("/:id", checkExists("quotes"), quotesController.show);
router.get("/:id/edit", checkExists("quotes"), quotesController.edit);
router.put("/:id", checkExists("quotes"), quotesController.update);
router.delete("/:id", checkExists("quotes"), quotesController.destroy);
router.put("/:id/archive", checkExists("quotes"), quotesController.archive);
router.put("/:id/active", checkExists("quotes"), quotesController.active);

router.post("/:id/comments", quoteCommentsController.create);
router.delete("/:quoteId/comments/:id", quoteCommentsController.destroy);

router.post("/:id/files", upload.single("displayName"), quoteFilesController.create);
router.delete("/:quoteId/files/:id", quoteFilesController.destroy);
router.get("/:quoteId/files/:id", quoteFilesController.download);

module.exports = router;
