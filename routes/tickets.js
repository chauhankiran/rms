const express = require("express");
const ticketsController = require("../controllers/tickets-controller");
const ticketCommentsController = require("../controllers/ticket-comments-controller");
const ticketFilesController = require("../controllers/ticket-files-controller");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const checkExists = require("../middleware/check-exists");

const router = express.Router();

router.get("/", ticketsController.index);
router.get("/view", ticketsController.showView); // change view
router.put("/view", ticketsController.view); // change view
router.get("/new", ticketsController.new);
router.post("/", ticketsController.create);
router.get("/:id", checkExists("tickets"), ticketsController.show);
router.get("/:id/edit", checkExists("tickets"), ticketsController.edit);
router.put("/:id", checkExists("tickets"), ticketsController.update);
router.delete("/:id", checkExists("tickets"), ticketsController.destroy);
router.put("/:id/archive", checkExists("tickets"), ticketsController.archive);
router.put("/:id/active", checkExists("tickets"), ticketsController.active);

router.post("/:id/comments", ticketCommentsController.create);
router.delete("/:ticketId/comments/:id", ticketCommentsController.destroy);

router.post("/:id/files", upload.single("displayName"), ticketFilesController.create);
router.delete("/:ticketFilesController/files/:id", ticketFilesController.destroy);
router.get("/:ticketFilesController/files/:id", ticketFilesController.download);

module.exports = router;
