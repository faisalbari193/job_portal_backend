const asyncHandler = require("../utils/asyncHandler");
const Brand = require("../model/brand.model");
exports.createBrandController = asyncHandler(async (req, res) => {
  const { brandName, brandImage } = req.body;
  const newBrand = new Brand({
    brandName,
    brandImage,
  });
  await newBrand.save();
  return apiResponse(res, 201, "Brand Logo created successfully");
});
exports.getBrandController = asyncHandler(async (req, res) => {
  const brand = await Brand.find();
  return apiResponse(res, 200, "Brand Logo fetched successfully", brand);
});
exports.updateBrandController = asyncHandler(async (req, res) => {
  const { brandName, brandImage } = req.body;
  const brand = await Brand.findByIdAndUpdate(
    req.params.id,
    { brandName, brandImage },
    { new: true },
  );
  return apiResponse(res, 200, "Brand Logo updated successfully", brand);
});
exports.deleteBrandController = asyncHandler(async (req, res) => {
  await Brand.findByIdAndDelete(req.params.id);
  return apiResponse(res, 200, "Brand Logo deleted successfully");
});
