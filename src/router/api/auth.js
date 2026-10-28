const express = require("express");
const {
  createUserController,
  signInController,
  verifyOtpController,
  otpResendController,
} = require("../../controller/auth.controller");

const router = express.Router();
router.post("/register", createUserController);
router.post("/login", signInController);
router.post("/verify-otp", verifyOtpController);
router.post("/resend-otp", otpResendController);
module.exports = router;
