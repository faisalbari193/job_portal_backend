const express = require("express");
const cors = require("cors");
const apiResponse = require("./utils/apiResponse");
const router = require("./router");
const app = express();
app.use(cors());
app.use(express.json());
app.use(router);
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  apiResponse(res, statusCode, err.message || "Internal Server Error");
});
module.exports = app;
