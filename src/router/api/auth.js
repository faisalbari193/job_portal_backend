const express = require("express");
const {
  signUpController,
  signinController,
  verifyOtpController,
  resendOtpController,
  forgotPasswordController,
  resetPasswordController,
} = require("../../controller/auth.controller");

const router = express.Router();
router.post("/register", signUpController);
router.post("/login", signinController);
router.post("/verify-otp", verifyOtpController);
router.post("/resend-otp", resendOtpController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password/:token", resetPasswordController);
module.exports = router;
