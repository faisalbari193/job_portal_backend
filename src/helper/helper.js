const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendOtpEmail = async (email, name, otp, type = "signup") => {
  try {
    const isResend = type === "resend";

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,

      subject: isResend ? "Your New OTP" : "Verify Your Email",

      html: `
        <div style="font-family:Arial;padding:20px">
          <h2>${isResend ? "New Verification Code" : "Welcome to Job Board!"}</h2>

          <p>Hello ${name},</p>

          <p>
            ${
              isResend
                ? "Here is your new OTP."
                : "Thank you for creating an account. Please verify your email."
            }
          </p>

          <h1 style="color:#2563eb">${otp}</h1>

          <p>This OTP expires in 5 minutes.</p>

          <p>Do not share your OTP with anyone.</p>

          <p>Regards,<br>Job Board Team</p>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.log("Email sending failed:", error.message);
    return false;
  }
};
const sendResetPasswordEmail = async (email, name, resetUrl) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Reset Your Password",
      html: `
        <div style="font-family:Arial;padding:20px">
          <h2>Password Reset Request</h2>

          <p>Hello ${name},</p>

          <p>Click the button below to reset your password.</p>

          <a href="${resetUrl}"
             style="background:#2563eb;color:white;padding:12px 20px;
             text-decoration:none;border-radius:5px;display:inline-block">
             Reset Password
          </a>

          <p>This link expires in 15 minutes.</p>

          <p>If you did not request this, ignore this email.</p>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.log("Reset email failed:", error.message);
    return false;
  }
};

module.exports = {
  sendOtpEmail,
  sendResetPasswordEmail,
};
module.exports = { sendOtpEmail, sendResetPasswordEmail };
