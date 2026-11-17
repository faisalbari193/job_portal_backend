const LatestJob = require("../model/latestJob.model");
const apiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

exports.createJobPostController = asyncHandler(async (req, res) => {
  let {
    headerText,
    subHeaderText,
    paraText,
    buttonText,
    jobPostingDate,
    jobType,
    companyLogo,
    companyName,
    jobPosition,
    jobDescription,
    applyBtn,
    salaryPerHour,
  } = req.body;
  const latestJob = new LatestJob({
    headerText,
    subHeaderText,
    paraText,
    buttonText,
    jobPostingDate,
    jobType,
    companyLogo,
    companyName,
    jobPosition,
    jobDescription,
    applyBtn,
    salaryPerHour,
  });
  await latestJob.save();
  apiResponse(res, 201, "Job post created successfully", latestJob);
});
exports.getAllJobPostsController = asyncHandler(async (req, res) => {
  const latestJobs = await LatestJob.find();
  apiResponse(res, 200, "All job posts retrieved successfully", latestJobs);
});
exports.updateJobPostController = asyncHandler(async (req, res) => {
  const {
    headerText,
    subHeaderText,
    paraText,
    buttonText,
    jobPostingDate,
    jobType,
    companyLogo,
    companyName,
    jobPosition,
    jobDescription,
    applyBtn,
    salaryPerHour,
  } = req.body;
  const latestJob = await LatestJob.findByIdAndUpdate(
    req.params.id,
    {
      headerText,
      subHeaderText,
      paraText,
      buttonText,
      jobPostingDate,
      jobType,
      companyLogo,
      companyName,
      jobPosition,
      jobDescription,
      applyBtn,
      salaryPerHour,
    },
    { new: true },
  );
  apiResponse(res, 200, "Job post updated successfully", latestJob);
});
exports.deleteJobPostController = asyncHandler(async (req, res) => {
  await LatestJob.findByIdAndDelete(req.params.id);
  apiResponse(res, 200, "Job post deleted successfully");
});
