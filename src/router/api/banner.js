const express = require("express");
const {
  createBannerController,
  getBannerController,
  updateBannerController,
  deleteBannerController,
} = require("../../controller/banner.controller");
const router = express.Router();
router.post("/create-banner", createBannerController);
router.get("/get-banner", getBannerController);
router.put("/update-banner/:id", updateBannerController);
router.delete("/delete-banner/:id", deleteBannerController);
module.exports = router;
