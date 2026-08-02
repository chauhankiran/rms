const express = require("express");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

router.use("/auth", require("./auth"));
router.use("/dashboard", isAuth, require("./dashboard"));
router.use("/companies", isAuth, require("./companies"));

module.exports = router;