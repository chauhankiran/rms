const express = require("express");
const ticketsController = require("../controllers/tickets-controller");
const ticketCommentsController = require("../controllers/ticket-comments-controller");
const ticketFilesController = require("../controllers/ticket-files-controller");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.get("/", ticketsController.index);
router.get("/new", ticketsController.new);
router.post("/", ticketsController.create);
router.get("/:id", ticketsController.show);
router.get("/:id/edit", ticketsController.edit);
router.put("/:id", ticketsController.update);
router.delete("/:id", ticketsController.destroy);
router.put("/:id/archive", ticketsController.archive);
router.put("/:id/active", ticketsController.active);

router.post("/:id/comments", ticketCommentsController.create);
router.delete("/:ticketId/comments/:id", ticketCommentsController.destroy);

router.post(
    "/:id/files",
    upload.single("displayName"),
    ticketFilesController.create
);
router.delete(
    "/:ticketFilesController/files/:id",
    ticketFilesController.destroy
);
router.get("/:ticketFilesController/files/:id", ticketFilesController.download);

module.exports = router;
