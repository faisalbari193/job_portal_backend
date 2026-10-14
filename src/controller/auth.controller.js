const { v4: uuidv4 } = require("uuid");
const User = require("../model/createUser.model");
const apiResponse = require("../utils/apiResponse");

const asyncHandler = require("../utils/asyncHandler");
const { sendOtpEmail } = require("../helper/helper");

exports.createUserController = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const otp = uuidv4().toString().substring(0, 4);
  const newUser = new User({
    name,
    email,
    password,
  });

  await newUser.save();
  await sendOtpEmail(email, name, otp);
  return apiResponse(res, 201, "User created successfully", newUser);
});
