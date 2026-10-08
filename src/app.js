const express = require("express");
const apiResponse = require("./utils/apiResponse");
const router = require("./router");
const app = express();
app.use(express.json());
app.use(router);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  apiResponse(res, statusCode, err.message || "Internal Server Error");
});
module.exports = app;
