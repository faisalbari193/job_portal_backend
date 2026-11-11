const asyncHandler = require("../utils/asyncHandler");

exports.brandController = asyncHandler(async (req, res) => {
  const { brandName, brandImage } = req.body;
  const newBrand = new Brand({
    brandName,
    brandImage,
  });
  await newBrand.save();
  return apiResponse(res, 201, "Brand Logo created successfully");
});
