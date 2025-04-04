const express = require("express");
const contactsController = require("../controllers/contacts-controller");

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

module.exports = router;
