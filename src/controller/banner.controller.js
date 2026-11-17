const asyncHandler = require("../utils/asyncHandler");
const Banner = require("../model/banner.model");
exports.createBannerController = asyncHandler(async (req, res) => {
  const { bannerTitle, bannerImage } = req.body;
  const newBanner = new Banner({
    bannerTitle,
    bannerImage,
  });
  await newBanner.save();
  return apiResponse(res, 201, "Banner created successfully");
});
exports.getBannerController = asyncHandler(async (req, res) => {
  const banner = await Banner.find();
  return apiResponse(res, 200, "Banner fetched successfully", banner);
});
exports.updateBannerController = asyncHandler(async (req, res) => {
  const { bannerTitle, bannerImage } = req.body;
  const banner = await Banner.findByIdAndUpdate(
    req.params.id,
    { bannerTitle, bannerImage },
    { new: true },
  );
  return apiResponse(res, 200, "Banner updated successfully", banner);
});
exports.deleteBannerController = asyncHandler(async (req, res) => {
  await Banner.findByIdAndDelete(req.params.id);
  return apiResponse(res, 200, "Banner deleted successfully");
});
