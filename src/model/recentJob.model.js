const mongoose = require("mongoose");
const recentJobSchema = new mongoose.Schema({
  headerText: { type: String, required: true },
  subHeaderText: { type: String, required: true },
  paraText: { type: String, required: true },
  buttonText: { type: String, required: true },
  image: { type: String, required: true },
});
const recentJob = mongoose.model("RecentJob", recentJobSchema);
module.exports = recentJob;
