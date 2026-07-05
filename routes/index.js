const express = require("express");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

router.use("/auth", require("./auth"));
router.use("/dashboard", isAuth, require("./dashboard"));

module.exports = router;