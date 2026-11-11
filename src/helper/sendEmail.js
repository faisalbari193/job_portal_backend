const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });

const sendEmail = (email, otp, name, type = "sign-up otp") => {
  const isResend = type === "resend otp";
  const isForgotPassword = type === "forgot password otp";
  const subject = isForgotPassword
    ? "Reset your password"
    : isResend
      ? "Your new verification code"
      : "Verify your email";
  const heading = isForgotPassword
    ? "Password reset"
    : isResend
      ? "Your new verification code"
      : "Verify your email";
  const message = isForgotPassword
    ? "Use the code below to reset your password."
    : isResend
      ? "Here is your new verification code."
      : "Thanks for signing up. Use this code to verify your email address.";

  return transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject,
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${escapeHtml(heading)}</title>
        </head>
        <body style="margin:0;padding:0;background-color:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f3f4f6;padding:36px 16px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background-color:#ffffff;border-radius:16px;overflow:hidden;">
                  <tr>
                    <td style="padding:32px 36px;background-color:#4338ca;color:#ffffff;">
                      <p style="margin:0 0 8px;font-size:12px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;color:#c7d2fe;">Account security</p>
                      <h1 style="margin:0;font-size:26px;line-height:1.3;">${escapeHtml(heading)}</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:32px 36px;">
                      <p style="margin:0 0 12px;font-size:16px;">Hello ${escapeHtml(name)},</p>
                      <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#4b5563;">${escapeHtml(message)}</p>
                      <div style="padding:20px;text-align:center;background-color:#eef2ff;border:1px solid #e0e7ff;border-radius:12px;">
                        <p style="margin:0 0 8px;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:#6366f1;">Your one-time code</p>
                        <p style="margin:0;font-size:32px;font-weight:bold;letter-spacing:8px;color:#312e81;">${escapeHtml(otp)}</p>
                      </div>
                      <p style="margin:20px 0 0;font-size:14px;line-height:1.6;color:#6b7280;">This code expires in <strong>10 minutes</strong>. For your security, do not share it with anyone.</p>
                      ${
                        isForgotPassword
                          ? '<p style="margin:16px 0 0;font-size:13px;line-height:1.6;color:#6b7280;">If you did not request a password reset, you can safely ignore this email.</p>'
                          : ""
                      }
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:20px 36px;border-top:1px solid #e5e7eb;text-align:center;">
                      <p style="margin:0;font-size:12px;color:#9ca3af;">This is an automated message. Please do not reply.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });
};

module.exports = sendEmail;
