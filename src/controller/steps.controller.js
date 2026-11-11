const asyncHandler = require("../utils/asyncHandler");

exports.stepController=asyncHandler(async (req, res) => {
  res.send("Step controller is working");
})