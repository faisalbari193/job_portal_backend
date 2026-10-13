const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendOtpEmail(email, name, otp) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Verify Your Email",
      text: `Hello ${name}, your verification code is ${otp}.`,
      html: `<div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:20px;color:#333"><h2 style="color:#2563eb">Verify Your Email</h2><p>Hello ${name},</p><p>Thank you for creating an account. Use the verification code below to verify your email address.</p><h1 style="background:#f1f5f9;color:#2563eb;text-align:center;padding:15px;font-size:18px;overflow-wrap:anywhere">${otp}</h1><p>This code expires in 5 minutes. Please do not share it with anyone.</p><p>Regards,<br><strong>Job Board Team</strong></p></div>`,
    });

    console.log("Message sent: %s", info.messageId);
    return true;
  } catch (err) {
    console.error("Error while sending mail:", err);
    return false;
  }
}

module.exports = { sendOtpEmail };
