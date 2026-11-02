const express = require("express");
const {
  createUserController,
  signInController,
  verifyOtpController,
  otpResendController,
  forgotPasswordController,
  resetPasswordController,
} = require("../../controller/auth.controller");

const router = express.Router();
router.post("/register", createUserController);
router.post("/login", signInController);
router.post("/verify-otp", verifyOtpController);
router.post("/resend-otp", otpResendController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password/:token", resetPasswordController);
module.exports = router;
