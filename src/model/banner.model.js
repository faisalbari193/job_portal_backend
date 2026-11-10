const mongoose = require("mongoose");
const bannerSchema = new mongoose.Schema({
  bannerTitle: {
    type: String,
    required: true,
  },
  bannerImage: {
    type: String,
    required: true,
  },
});
const Banner = mongoose.model("Banner", bannerSchema);
module.exports = Banner;
