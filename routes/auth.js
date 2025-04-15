const express = require("express");
const authController = require("../controllers/auth-controller");

const router = express.Router();

router.get("/login", authController.showLogin);
router.post("/login", authController.login);
router.get("/register", authController.showRegister);
router.post("/register", authController.register);
router.get("/logout", authController.logout);
router.get("/reset", authController.showReset);
router.put("/reset", authController.reset);

router.get("/forgot-password", authController.showForgotPassword);
router.put("/forgot-password", authController.forgotPassword);
router.get("/reset-password/:id", authController.showResetPassword);
router.put("/reset-password", authController.resetPassword);
router.get("/password-reset-success", authController.showPasswordResetSuccess);

module.exports = router;
