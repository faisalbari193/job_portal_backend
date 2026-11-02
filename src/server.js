require("dotenv").config();
const otpCleanup = require("./cron/otpCleanup");
const app = require("./app");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 8080;

otpCleanup();

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
