const asyncHandler = require("../utils/asyncHandler");
const RecentJob = require("../model/recentJob.model");
exports.createRecentJobController = asyncHandler(async (req, res) => {
  const { headerText, subHeaderText, paraText, buttonText, image } = req.body;

  if (!headerText || !subHeaderText || !paraText || !buttonText || !image) {
    return apiResponse(res, 400, "All fields are required");
  }

  const recentJob = new RecentJob({
    headerText,
    subHeaderText,
    paraText,
    buttonText,
    image,
  });

  await recentJob.save();
  return apiResponse(res, 201, "Recent job created successfully", recentJob);
});
exports.getRecentJobController = asyncHandler(async (req, res) => {
  const recentJob = await RecentJob.find();
  return apiResponse(res, 200, "Recent job fetched successfully", recentJob);
});
exports.updateRecentJobController = asyncHandler(async (req, res) => {
  const { headerText, subHeaderText, paraText, buttonText, image } = req.body;

  const recentJob = await RecentJob.findByIdAndUpdate(
    req.params.id,
    { headerText, subHeaderText, paraText, buttonText, image },
    { new: true },
  );

  return apiResponse(res, 200, "Recent job updated successfully", recentJob);
});
exports.deleteRecentJobController = asyncHandler(async (req, res) => {
  await RecentJob.findByIdAndDelete(req.params.id);
  return apiResponse(res, 200, "Recent job deleted successfully");
});
