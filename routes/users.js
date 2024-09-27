const express = require("express");
const usersController = require("../controllers/users-controller");

const router = express.Router();

router.get("/", usersController.index);
router.get("/new", usersController.new);
router.post("/", usersController.create);
router.get("/:id", usersController.show);
router.get("/:id/edit", usersController.edit);
router.put("/:id", usersController.update);
router.delete("/:id", usersController.destroy);
router.put("/:id/archive", usersController.archive);
router.put("/mass-actions/active", usersController.massActionsActive);
router.put("/mass-actions/deactive", usersController.massActionsDeActive);
router.delete("/mass-actions/delete", usersController.massActionsDelete);

module.exports = router;
