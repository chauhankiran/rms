const express = require("express");
const dashboardController = require("../controllers/dashboard-controller");
const router = express.Router();

router.get("/", dashboardController.index);

module.exports = router;
