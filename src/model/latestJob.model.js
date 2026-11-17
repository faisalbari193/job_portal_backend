const mongoose = require("mongoose");
const latestJobSchema = new mongoose.Schema({
  headerText: { type: String, required: true },
  subHeaderText: { type: String, required: true },
  paraText: { type: String, required: true },
  buttonText: { type: String, required: true },
  jobPostingDate: { type: Date, required: true },
  jobType: { type: String, required: true },
  companyLogo: { type: String, required: true },
  companyName: [
    {
      companyName: { type: String, required: true },
      location: { type: String, required: true },
    },
  ],
  jobPosition: { type: String, required: true },
  jobDescription: { type: String, required: true },
  applyBtn: { type: String, required: true },
  salaryPerHour: { type: Number, required: true },
});
const LatestJob = mongoose.model("LatestJob", latestJobSchema);
module.exports = LatestJob;
