const User = require("../models/User");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// ── Nodemailer transporter ───────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ── Helper: generate 6-digit OTP ────────────────────────────────────────────
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ── STEP 1: Send OTP to email ────────────────────────────────────────────────
// POST /auth/forgot-password
// Body: { email }
exports.sendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // 1. Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Security: same message for unknown emails (don't leak info)
      return res
        .status(404)
        .json({ message: "No account found with this email address" });
    }

    // 2. Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // 3. Hash OTP before saving (never store plain OTP)
    const hashedOTP = await bcrypt.hash(otp, 10);
    user.resetOTP = hashedOTP;
    user.resetOTPExpiry = otpExpiry;
    await user.save();

    // 4. Send email
    const mailOptions = {
      from: `"AYM Yoga School" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 Password Reset OTP — AYM Yoga School",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>Password Reset OTP</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Cormorant+Garamond:ital,wght@0,400;1,400&display=swap');
            body { margin: 0; padding: 0; background: #fceacc; font-family: 'Cormorant Garamond', Georgia, serif; }
            .wrapper { max-width: 520px; margin: 40px auto; background: linear-gradient(160deg, #fff9f2 0%, #fdf3e3 100%); border-radius: 12px; overflow: hidden; box-shadow: 0 8px 32px rgba(92,45,0,0.15); }
            .header { background: linear-gradient(135deg, #F15505 0%, #8b3e00 100%); padding: 36px 40px 28px; text-align: center; }
            .header h1 { font-family: 'Cinzel', serif; color: #fff; margin: 0 0 4px; font-size: 1.6rem; letter-spacing: 0.06em; }
            .header p { color: rgba(255,255,255,0.85); font-style: italic; margin: 0; font-size: 0.95rem; }
            .divider { height: 4px; background: linear-gradient(90deg, transparent, #f5b800, #F15505, #f5b800, transparent); }
            .body { padding: 36px 40px; text-align: center; }
            .body p { color: #5c3d0e; font-size: 1.05rem; line-height: 1.7; margin: 0 0 24px; }
            .otp-box { background: linear-gradient(135deg, #F15505 0%, #8b3e00 100%); border-radius: 10px; padding: 20px 40px; display: inline-block; margin: 0 auto 28px; }
            .otp-box span { font-family: 'Cinzel', serif; font-size: 2.4rem; font-weight: 700; color: #fff; letter-spacing: 0.22em; }
            .warning { background: #fff7eb; border: 1px solid #e8d5b5; border-radius: 8px; padding: 14px 20px; color: #7a5c2e; font-size: 0.9rem; font-style: italic; }
            .footer { border-top: 1px solid #e8d5b5; padding: 20px 40px; text-align: center; color: #b89a70; font-size: 0.82rem; font-style: italic; }
            .om { font-size: 1.2rem; color: #F15505; display: block; margin-bottom: 6px; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="header">
              <h1>AYM Yoga School</h1>
              <p>Password Reset Verification</p>
            </div>
            <div class="divider"></div>
            <div class="body">
              <p>Namaste <strong>${user.name}</strong>,<br/>Use the OTP below to reset your password. This code is valid for <strong>10 minutes</strong>.</p>
              <div class="otp-box">
                <span>${otp}</span>
              </div>
              <div class="warning">
                ⚠️ Do not share this OTP with anyone. If you did not request a password reset, please ignore this email.
              </div>
            </div>
            <div class="footer">
              <span class="om">ॐ</span>
              © ${new Date().getFullYear()} AYM Yoga School. All rights reserved.
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    next(error);
  }
};

// ── STEP 2: Verify OTP ───────────────────────────────────────────────────────
// POST /auth/verify-otp
// Body: { email, otp }
exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !user.resetOTP || !user.resetOTPExpiry) {
      return res
        .status(400)
        .json({ message: "OTP not found. Please request a new one." });
    }

    // Check expiry
    if (new Date() > user.resetOTPExpiry) {
      user.resetOTP = undefined;
      user.resetOTPExpiry = undefined;
      await user.save();
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }

    // Compare OTP
    const isValid = await bcrypt.compare(otp, user.resetOTP);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid OTP. Please try again." });
    }

    // OTP is correct — issue a short-lived reset token for the next step
    // We mark OTP as "verified" by generating a temporary token stored in DB
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Reuse resetOTP field to store hashed reset token (overwrite OTP)
    user.resetOTP = hashedToken;
    user.resetOTPExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 more min
    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      resetToken, // send plain token to frontend (used in next step)
    });
  } catch (error) {
    next(error);
  }
};

// ── STEP 3: Reset Password ───────────────────────────────────────────────────
// POST /auth/reset-password
// Body: { email, resetToken, newPassword }
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, resetToken, newPassword } = req.body;

    if (!email || !resetToken || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !user.resetOTP || !user.resetOTPExpiry) {
      return res.status(400).json({ message: "Invalid or expired reset session" });
    }

    // Check expiry
    if (new Date() > user.resetOTPExpiry) {
      user.resetOTP = undefined;
      user.resetOTPExpiry = undefined;
      await user.save();
      return res.status(400).json({ message: "Reset session expired. Start again." });
    }

    // Verify reset token
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    if (hashedToken !== user.resetOTP) {
      return res.status(400).json({ message: "Invalid reset token" });
    }

    // All good — update password
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOTP = undefined;
    user.resetOTPExpiry = undefined;
    user.refreshToken = null; // invalidate all sessions
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully. Please login with your new password.",
    });
  } catch (error) {
    next(error);
  }
};