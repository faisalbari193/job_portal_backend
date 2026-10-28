const { v4: uuidv4 } = require("uuid");
const User = require("../model/createUser.model");
const apiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { sendOtpEmail } = require("../helper/helper");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { set } = require("mongoose");
exports.createUserController = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10, async function (err, hash) {
    if (err) {
      return apiResponse(res, 500, err || "Error hashing password");
    } else {
      const otp = uuidv4().toString().substring(0, 4);
      const newUser = new User({
        name,
        email,
        otp,
        password: hash,
        otpExpires: Date.now() + 5 * 60 * 1000, // Set OTP expiration time to 5 minutes from now
      });
      await newUser.save();
      setTimeout(async () => {
        newUser.otp = null;
        newUser.otpExpires = null;
        await newUser.save();
        return apiResponse(res, 200, "OTP expired");
      }, 300000); // Clear OTP after 5 minutes
      sendOtpEmail(email, name, otp);
      return apiResponse(res, 201, "User created successfully", newUser);
    }
  });
});
exports.signInController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email }).select("+password");
  if (!existingUser) {
    return apiResponse(res, 404, "invalid credentials");
  } else {
    bcrypt.compare(password, existingUser.password, function (err, result) {
      if (result) {
        let user = {
          name: existingUser.name,
          email: existingUser.email,
          role: existingUser.role,
          isActive: existingUser.isActive,
          isVerified: existingUser.isVerified,
        };
        const jwtSecret = process.env.privateKey;
        if (!jwtSecret) {
          return apiResponse(
            res,
            500,
            "JWT_SECRET is missing from the .env file",
          );
        }
        const token = jwt.sign(
          { email: existingUser.email, id: existingUser._id },
          jwtSecret,
          {
            expiresIn: "10min",
            algorithm: "HS256",
          },
        );
        return apiResponse(res, 200, "login successful", { ...user, token });
      } else {
        return apiResponse(res, 401, err || "invalid credentials");
      }
    });
  }
});
exports.verifyOtpController = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (user.otp == otp) {
    if (user.otpExpires > new Date()) {
      user.isVerified = true;
      user.otp = null;
      await user.save();
      return apiResponse(res, 200, "OTP verified successfully");
    } else {
      return apiResponse(res, 400, "OTP has expired");
    }
  } else {
    return apiResponse(res, 400, "Invalid OTP");
  }
});
exports.otpResendController = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return apiResponse(res, 404, "User not found");
  }
  const otp = uuidv4().toString().substring(0, 4);
  user.otp = otp;
  user.otpExpires = Date.now() + 5 * 60 * 1000; // Set OTP expiration time to 5 minutes from now
  await user.save();
  sendOtpEmail(email, user.name, otp);
  return apiResponse(res, 200, "OTP resent successfully");
});
