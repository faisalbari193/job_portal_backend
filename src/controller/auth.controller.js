const { v4: uuidv4 } = require("uuid");
const User = require("../model/createUser.model");
const apiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { sendOtpEmail } = require("../helper/helper");
const jwt = require("jsonwebtoken");
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
        password: hash,
        otpExpires: Date.now() + 5 * 60 * 1000, // Set OTP expiration time to 5 minutes from now
      });
      await newUser.save();
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
        jwt.sign(
          { email: existingUser.email, id: existingUser._id },
          privateKey,
          { expiresIn: '10min' },
          { algorithm: "RS256" },
          function (err, token) {
            apiResponse(res, 200, "login successful", { ...user, token });
          },
        );
        
      } else {
        return apiResponse(res, 401, err || "invalid credentials");
      }
    });
  }
});
