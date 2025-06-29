const express = require("express");
const adminController = require("../controllers/admin/admin-controller");
const usersController = require("../controllers/admin/users-controller");
const refsController = require("../controllers/admin/refs-controller");
const labelsController = require("../controllers/admin/labels-controller");

const checkRef = require("../middleware/check-ref");
const checkLabel = require("../middleware/check-label");
const { route } = require("./auth");

const router = express.Router();

router.get("/", adminController.index);
router.get("/labels", adminController.labels);
router.get("/refs", adminController.refs);

/**
 * Users
 */
router.get("/users", usersController.index);
router.get("/users/new", usersController.new);
router.post("/users", usersController.create);
router.get("/users/:id", usersController.show);
router.get("/users/:id/edit", usersController.edit);
router.put("/users/:id", usersController.update);
router.delete("/users/:id", usersController.destroy);
router.put("/users/:id/archive", usersController.archive);
router.put("/users/mass-actions/active", usersController.massActionsActive);
router.put("/users/mass-actions/deactive", usersController.massActionsDeActive);
router.delete("/users/mass-actions/delete", usersController.massActionsDelete);

/**
 * Labels
 */
router.use("/labels/:label", checkLabel);

router.get("/labels/:label", labelsController.index);
router.get("/labels/:label/:id", labelsController.show);
router.get("/labels/:label/:id/edit", labelsController.edit);
router.put("/labels/:label/:id", labelsController.update);
router.put("/labels/:label/:id/archive", labelsController.archive);
router.put("/labels/:label/:id/active", labelsController.active);

/**
 * Refs.
 */
router.use("/refs/:ref", checkRef);

router.get("/refs/:ref", refsController.index);
router.get("/refs/:ref/new", refsController.new);
router.post("/refs/:ref", refsController.create);
router.get("/refs/:ref/:id", refsController.show);
router.get("/refs/:ref/:id/edit", refsController.edit);
router.put("/refs/:ref/:id", refsController.update);
router.delete("/refs/:ref/:id", refsController.destroy);
router.put("/refs/:ref/:id/archive", refsController.archive);
router.put("/refs/:ref/:id/active", refsController.active);

module.exports = router;
