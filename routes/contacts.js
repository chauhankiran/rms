const express = require("express");
const contactsController = require("../controllers/contacts-controller");
const contactCommentsController = require("../controllers/contact-comments-controller");
const contactFilesController = require("../controllers/contact-files-controller");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const checkExists = require("../middleware/check-exists");

const router = express.Router();

router.get("/", contactsController.index);
router.get("/view", contactsController.showView); // change view
router.put("/view", contactsController.view); // change view
router.get("/new", contactsController.new);
router.post("/", contactsController.create);
router.get("/:id", contactsController.show);
router.get("/:id/edit", contactsController.edit);
router.put("/:id", checkExists("contacts"), contactsController.update);
router.delete("/:id", checkExists("contacts"), contactsController.destroy);
router.put("/:id/archive", checkExists("contacts"), contactsController.archive);
router.put("/:id/active", checkExists("contacts"), contactsController.active);

router.post("/:id/comments", contactCommentsController.create);
router.delete("/:contactId/comments/:id", contactCommentsController.destroy);

router.post("/:id/files", upload.single("displayName"), contactFilesController.create);
router.delete("/:contactId/files/:id", contactFilesController.destroy);
router.get("/:contactId/files/:id", contactFilesController.download);

module.exports = router;
