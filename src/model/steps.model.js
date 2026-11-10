const mongoose = require("mongoose");
const stepsSchema = new mongoose.Schema({
  stepHeader: {
    type: String,
    required: true,
  },
  stepTitle: {
    type: String,
    required: true,
  },
  stepDescription: {
    type: String,
    required: true,
  },
  stepLogo: {
    type: String,
    required: true,
  },
  stepLogoTitle: {
    type: String,
    required: true,
  },
  stepLogoDescription: {
    type: String,
    required: true,
  },
});
