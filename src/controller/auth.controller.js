const asyncHandler = require("../utils/asyncHandler");
const bcrypt = require("bcrypt");
const User = require("../model/user.model");
const sendEmail = require("../helper/sendEmail");
const apiResponse = require("../utils/apiResponse");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

//sign up controller
exports.signUpController = asyncHandler(async (req, res) => {
  let { name, email, password } = req.body;

  if (!email) {
    return apiResponse(res, 400, "Email is required");
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return apiResponse(res, 400, "User already exists");
  } else {
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        return apiResponse(res, 500, err || "Internal server error");
      } else {
        const otp = uuidv4().toString().substring(0, 4);
        let user = new User({
          name,
          email,
          password: hash,
          otp: otp,
          otpExpiry: Date.now() + 10 * 60 * 1000, // OTP expires in 10 minutes
        });
        await user.save();
        await sendEmail(email, otp, name, "sign-up otp");
        setTimeout(
          async () => {
            user.otp = null;
            user.otpExpiry = null;
            await user.save();
          },
          10 * 60 * 1000,
        ); // Clear OTP after 10 minutes
        return apiResponse(
          res,
          200,
          "User registered successfully. Please check your email for the OTP.",
        );
      }
    });
  }
});
//verify otp controller
exports.verifyOtpController = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return apiResponse(res, 400, "Email and OTP are required");
  }
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    return apiResponse(res, 400, "User not found");
  }
  if (existingUser.isVerified) {
    return apiResponse(res, 400, "User already verified");
  }
  if (existingUser.otp == otp) {
    if (existingUser.otpExpiry > new Date()) {
      existingUser.otp = null;
      existingUser.otpExpiry = null;
      existingUser.isVerified = true;
      await existingUser.save();
      return apiResponse(res, 200, "User verified successfully");
    }
  } else {
    return apiResponse(res, 400, "Invalid OTP");
  }
});
//otp resend controller
exports.resendOtpController = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    return apiResponse(res, 400, "User not found");
  } else {
    if (existingUser.otpExpiry > new Date()) {
      return apiResponse(
        res,
        429,
        "OTP resend limit exceeded. Please wait for 10 minutes before requesting a new OTP.",
      );
    } else {
      const otp = uuidv4().toString().substring(0, 4);
      existingUser.otp = otp;
      existingUser.otpExpiry = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
      await existingUser.save();
      await sendEmail(email, otp, existingUser.name, "resend otp");
      return apiResponse(
        res,
        200,
        "OTP resent successfully. Please check your email for the new OTP.",
      );
    }
  }
});
exports.signinController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return apiResponse(res, 400, "Invalid Credentials");
  }
  const existingUser = await User.findOne({ email }).select("+password");
  if (!existingUser) {
    return apiResponse(res, 400, "User not found");
  } else {
    bcrypt.compare(password, existingUser.password, (err, result) => {
      if (result) {
        let userData = {
          name: existingUser.name,
          email: existingUser.email,
          role: existingUser.role,
          isActive: existingUser.isActive,
          isVerified: existingUser.isVerified,
        };
        jwt.sign(
          { email: userData.email, id: userData._id },
          process.env.JWT_SECRET,
          { expiresIn: "5min" },
          function (err, token) {
            apiResponse(res, 200, "User signed in successfully", {
              ...userData,
              token,
            });
          },
        );
      } else {
        return apiResponse(res, 400, "Invalid Credentials");
      }
    });
  }
});
exports.forgotPasswordController = asyncHandler(async (req, res) => {
  const { email } = req.body;
  let existingUser = await User.findOne({ email });
  if (existingUser) {
    const otp = uuidv4().toString().substring(0, 4);
    existingUser.otp = otp;
    existingUser.otpExpiry = Date.now() + 10 * 60 * 1000;
    await existingUser.save();
    await sendEmail(email, otp, existingUser.name, "forgot password otp");
    return apiResponse(res, 200, "OTP sent to your email for password reset");
  }
});
exports.resetPasswordController = asyncHandler(async (req, res) => {
  const { email, otp, password } = req.body;
  let existingUser = await User.findOne({ email });
  if (existingUser) {
    if (existingUser.otp == otp) {
      if (existingUser.otpExpiry > new Date()) {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUser.password = hashedPassword;
        existingUser.otp = null;
        existingUser.otpExpiry = null;
        await existingUser.save();
        return apiResponse(res, 200, "Password reset successfully");
      } else {
        return apiResponse(res, 400, "OTP expired");
      }
    } else {
      return apiResponse(res, 400, "Invalid OTP");
    }
  } else {
    return apiResponse(res, 400, "User not found");
  }
});