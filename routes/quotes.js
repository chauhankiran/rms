const express = require("express");
const quotesController = require("../controllers/quotes-controller");
const quoteCommentsController = require("../controllers/quote-comments-controller");

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

module.exports = router;
