const express = require("express");
const ticketsController = require("../controllers/tickets-controller");

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

module.exports = router;
