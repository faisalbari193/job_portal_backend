const express = require("express");
const { brandController } = require("../../controller/brand.controller");
const router = express.Router();
router.post("/create-brand", brandController);
module.exports = router;
