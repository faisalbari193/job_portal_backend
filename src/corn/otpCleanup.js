const cron = require("node-cron");
const User = require("../model/createUser.model");

const otpCleanup = () => {
  // Every minute
  cron.schedule("* * * * *", async () => {
    try {
      const result = await User.updateMany(
        {
          otpExpires: { $lte: new Date() },
          otp: { $ne: null },
        },
        {
          $set: {
            otp: null,
            otpExpires: null,
          },
        },
      );

      console.log(`${result.modifiedCount} expired OTP cleared`);
    } catch (error) {
      console.log("OTP cleanup failed:", error.message);
    }
  });
};

module.exports = otpCleanup;
