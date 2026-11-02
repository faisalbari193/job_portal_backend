const { v4: uuidv4 } = require("uuid");
const User = require("../model/createUser.model");
const apiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { sendOtpEmail, sendResetPasswordEmail } = require("../helper/helper");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
exports.createUserController = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    return apiResponse(res, 409, "Email already exists");
  }

  const hash = await bcrypt.hash(password, 10);

  // Numeric 4-digit OTP
  const otp = crypto.randomInt(1000, 10000).toString();

  const newUser = new User({
    name,
    email: normalizedEmail,
    otp,
    password: hash,
    otpExpires: new Date(Date.now() + 5 * 60 * 1000),
  });

  await newUser.save();

  const emailSent = await sendOtpEmail(normalizedEmail, name, otp, "signup");

  if (!emailSent) {
    newUser.otp = null;
    newUser.otpExpires = null;
    await newUser.save();

    return apiResponse(res, 500, "Failed to send OTP email");
  }

  return apiResponse(res, 201, "User created successfully", {
    name: newUser.name,
    email: newUser.email,
  });
});
exports.signInController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({
    email: normalizedEmail,
  }).select("+password");

  if (!existingUser) {
    return apiResponse(res, 401, "Invalid credentials");
  }

  const isPasswordMatch = await bcrypt.compare(password, existingUser.password);

  if (!isPasswordMatch) {
    return apiResponse(res, 401, "Invalid credentials");
  }

  if (!existingUser.isVerified) {
    return apiResponse(res, 403, "Please verify your email first");
  }

  if (!existingUser.isActive) {
    return apiResponse(res, 403, "Your account is blocked");
  }

  const jwtSecret = process.env.privateKey;

  if (!jwtSecret) {
    return apiResponse(res, 500, "JWT_SECRET is missing from the .env file");
  }

  const user = {
    name: existingUser.name,
    email: existingUser.email,
    role: existingUser.role,
    isActive: existingUser.isActive,
    isVerified: existingUser.isVerified,
  };

  const token = jwt.sign(
    {
      email: existingUser.email,
      id: existingUser._id,
    },
    jwtSecret,
    {
      expiresIn: "10min",
      algorithm: "HS256",
    },
  );

  return apiResponse(res, 200, "Login successful", {
    ...user,
    token,
  });
});
exports.verifyOtpController = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({
    email: email.trim().toLowerCase(),
  }).select("+otp +otpExpires");

  if (!user) {
    return apiResponse(res, 404, "User not found");
  }

  if (user.isVerified) {
    return apiResponse(res, 400, "Email already verified");
  }

  if (!user.otp || !user.otpExpires) {
    return apiResponse(res, 400, "OTP not found");
  }

  // OTP expiry check — এখানে বসবে
  if (user.otpExpires <= new Date()) {
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return apiResponse(res, 400, "OTP expired");
  }

  // OTP match check
  if (user.otp !== otp) {
    return apiResponse(res, 400, "Invalid OTP");
  }

  user.isVerified = true;
  user.otp = null;
  user.otpExpires = null;

  await user.save();

  return apiResponse(res, 200, "Email verified successfully");
});
exports.otpResendController = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({
    email: normalizedEmail,
  }).select("+otp +otpExpires");

  if (!user) {
    return apiResponse(res, 404, "User not found");
  }

  if (user.isVerified) {
    return apiResponse(res, 400, "Email already verified");
  }

  const otp = crypto.randomInt(1000, 10000).toString();

  user.otp = otp;
  user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);

  await user.save();

  const emailSent = await sendOtpEmail(user.email, user.name, otp, "resend");

  if (!emailSent) {
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return apiResponse(res, 500, "Failed to send OTP email");
  }

  return apiResponse(res, 200, "OTP resent successfully");
});
exports.forgotPasswordController = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return apiResponse(res, 400, "Email is required");
  }

  const user = await User.findOne({ email });

  // Do not reveal whether email exists
  if (!user) {
    return apiResponse(
      res,
      200,
      "If your email exists, a reset link will be sent",
    );
  }

  // Generate secure random token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash token before saving to database
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = hashedToken;

  // Expire after 15 minutes
  user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

  await user.save();

  // Create frontend reset URL
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  // Send email
  const emailSent = await sendResetPasswordEmail(
    user.email,
    user.name,
    resetUrl,
  );

  if (!emailSent) {
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return apiResponse(res, 500, "Failed to send reset email");
  }

  return apiResponse(
    res,
    200,
    "If your email exists, a reset link will be sent",
  );
});
exports.resetPasswordController = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token || !password) {
    return apiResponse(res, 400, "Token and password are required");
  }

  // Hash incoming token
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Check token and expiration
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) {
    return apiResponse(res, 400, "Invalid or expired reset link");
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Atomically update password and clear token
  const updatedUser = await User.findOneAndUpdate(
    {
      _id: user._id,
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    },
    {
      $set: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedUser) {
    return apiResponse(res, 400, "Invalid or expired reset link");
  }

  return apiResponse(res, 200, "Password reset successful");
});
