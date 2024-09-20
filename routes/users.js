const express = require("express");
const usersController = require("../controllers/usersController");
const router = express.Router();

router.get("/", usersController.index);
router.get("/new", usersController.new);
router.post("/", usersController.create);
router.get("/:id", usersController.show);

module.exports = router;
