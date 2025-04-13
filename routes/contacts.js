const express = require("express");
const contactsController = require("../controllers/contacts-controller");
const contactCommentsController = require("../controllers/contact-comments-controller");
const contactFilesController = require("../controllers/contact-files-controller");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.get("/", contactsController.index);
router.get("/new", contactsController.new);
router.post("/", contactsController.create);
router.get("/:id", contactsController.show);
router.get("/:id/edit", contactsController.edit);
router.put("/:id", contactsController.update);
router.delete("/:id", contactsController.destroy);
router.put("/:id/archive", contactsController.archive);
router.put("/:id/active", contactsController.active);

router.post("/:id/comments", contactCommentsController.create);
router.delete("/:contactId/comments/:id", contactCommentsController.destroy);

router.post(
    "/:id/files",
    upload.single("displayName"),
    contactFilesController.create
);
router.delete("/:contactId/files/:id", contactFilesController.destroy);
router.get("/:contactId/files/:id", contactFilesController.download);

module.exports = router;
