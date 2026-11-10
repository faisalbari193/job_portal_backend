const mongoose = require("mongoose");
const bannerSchema = new mongoose.Schema({
  bannerLogo: {
    type: String,
    required: true,
  },
});
const Banner = mongoose.model("Banner", bannerSchema);
module.exports = Banner;