const asyncHandler = require("../utils/asyncHandler");

exports.bannerController = asyncHandler(async (req, res) => {
  const { bannerTitle, bannerImage } = req.body;
  const newBanner = new Banner({
    bannerTitle,
    bannerImage,
  });
  await newBanner.save();
  return apiResponse(res, 201, "Banner created successfully");
});
