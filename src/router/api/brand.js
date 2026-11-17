const express = require("express");
const {
  getBrandController,
  createBrandController,
  updateBrandController,
  deleteBrandController,
} = require("../../controller/brand.controller");
const router = express.Router();
router.post("/create-brand", createBrandController);
router.get("/get-brand", getBrandController);
router.put("/update-brand/:id", updateBrandController);
router.delete("/delete-brand/:id", deleteBrandController);
module.exports = router;
