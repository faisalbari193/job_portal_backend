const express = require("express");
const { createUserController } = require("../../controller/auth.controller");

const router = express.Router();
router.post("/register", createUserController);
module.exports = router;
