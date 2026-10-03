const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function validateContact({ name, email, subject, message }) {
  const errors = [];
  if (!name || name.trim().length < 3)
    errors.push("Name must be at least 3 characters.");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.push("Valid email is required.");
  if (!subject || !subject.trim()) errors.push("Subject is required.");
  if (!message || message.trim().length < 10)
    errors.push("Message must be at least 10 characters.");
  return errors;
}

function adminEmailHTML({ name, email, phone, subject, course, message }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>New Contact Form Submission</title>
<style>
  body { margin:0; padding:0; background:#f5e6c8; font-family:'Georgia',serif; }
  .wrap { max-width:620px; margin:30px auto; background:#fdf6e3;
    border:2px solid #b8860b; border-radius:4px; overflow:hidden;
    box-shadow:0 8px 30px rgba(0,0,0,0.18); }
  .head { background:linear-gradient(135deg,#3d1c00,#5c2e00,#3d1c00);
    padding:28px 32px; text-align:center; border-bottom:3px double #b8860b; }
  .head h1 { margin:0; color:#d4a017; font-size:1.3rem; letter-spacing:0.15em;
    text-shadow:0 2px 8px rgba(0,0,0,0.5); }
  .head p { margin:6px 0 0; color:rgba(232,213,163,0.75); font-size:0.82rem;
    font-style:italic; letter-spacing:0.1em; }
  .badge { display:inline-block; margin-top:10px; background:rgba(184,134,11,0.2);
    border:1px solid rgba(184,134,11,0.5); border-radius:20px; padding:3px 14px;
    color:#d4a017; font-size:0.72rem; letter-spacing:0.12em; }
  .body { padding:28px 32px; }
  .row { display:flex; gap:16px; margin-bottom:14px; }
  .field { flex:1; }
  .label { font-size:0.68rem; letter-spacing:0.12em; text-transform:uppercase;
    color:#8b3a0f; margin-bottom:4px; }
  .value { font-size:0.95rem; color:#2a1a0a; background:rgba(232,213,163,0.4);
    border-left:3px solid #b8860b; padding:8px 12px; border-radius:0 2px 2px 0;
    word-break:break-word; }
  .message-box { background:rgba(232,213,163,0.3); border:1px solid rgba(184,134,11,0.3);
    border-left:3px solid #b8860b; padding:14px 16px; border-radius:0 2px 2px 0;
    font-size:0.95rem; color:#2a1a0a; line-height:1.7; white-space:pre-wrap;
    word-break:break-word; }
  .divider { text-align:center; margin:20px 0; color:#b8860b; font-size:0.7rem;
    letter-spacing:0.2em; }
  .foot { background:linear-gradient(135deg,#3d1c00,#5c2e00,#3d1c00);
    padding:14px 32px; text-align:center; border-top:2px solid #b8860b; }
  .foot p { margin:0; color:rgba(232,213,163,0.65); font-size:0.72rem;
    font-style:italic; letter-spacing:0.08em; }
  @media (max-width:500px){ .row{flex-direction:column;} }
</style>
</head>
<body>
<div class="wrap">
  <div class="head">
    <h1>AYM Yoga School</h1>
    <p>New Contact Form Submission</p>
    <span class="badge">🙏 Incoming Inquiry</span>
  </div>
  <div class="body">

    <div class="row">
      <div class="field">
        <div class="label">Full Name</div>
        <div class="value">${escapeHtml(name)}</div>
      </div>
      <div class="field">
        <div class="label">Email</div>
        <div class="value">${escapeHtml(email)}</div>
      </div>
    </div>

    <div class="row">
      <div class="field">
        <div class="label">Phone</div>
        <div class="value">${escapeHtml(phone || "Not provided")}</div>
      </div>
      <div class="field">
        <div class="label">Interested Course</div>
        <div class="value">${escapeHtml(course || "General Inquiry")}</div>
      </div>
    </div>

    <div style="margin-bottom:14px">
      <div class="label">Subject</div>
      <div class="value">${escapeHtml(subject)}</div>
    </div>

    <div class="divider">◆ &nbsp; Message &nbsp; ◆</div>

    <div class="message-box">${escapeHtml(message)}</div>

    <div class="divider" style="margin-top:22px">◆ &nbsp; ॐ &nbsp; ◆</div>
    <p style="text-align:center;font-size:0.78rem;color:#7a5c2e;font-style:italic;margin:0">
      Received on ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
    </p>
  </div>
  <div class="foot">
    <p>Indian Yoga Association · Upper Tapovan, Rishikesh · aymindia@gmail.com</p>
  </div>
</div>
</body>
</html>`;
}

function userEmailHTML({ name, course, subject }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Thank You – AYM Yoga School</title>
<style>
  body { margin:0; padding:0; background:#f5e6c8; font-family:'Georgia',serif; }
  .wrap { max-width:580px; margin:30px auto; background:#fdf6e3;
    border:2px solid #b8860b; border-radius:4px; overflow:hidden;
    box-shadow:0 8px 30px rgba(0,0,0,0.18); }
  .head { background:linear-gradient(135deg,#3d1c00,#5c2e00,#3d1c00);
    padding:32px; text-align:center; border-bottom:3px double #b8860b; }
  .om { font-size:3rem; color:#d4a017; display:block; margin-bottom:8px;
    text-shadow:0 0 20px rgba(184,134,11,0.6); }
  .head h1 { margin:0; color:#d4a017; font-size:1.25rem; letter-spacing:0.18em; }
  .head p { margin:6px 0 0; color:rgba(232,213,163,0.75); font-style:italic;
    font-size:0.82rem; letter-spacing:0.1em; }
  .body { padding:32px; }
  .greeting { font-size:1.1rem; color:#2a1a0a; margin-bottom:14px; }
  .greeting strong { color:#8b3a0f; }
  .para { font-size:0.93rem; color:#4a2e10; line-height:1.8; margin-bottom:12px; }
  .highlight { background:rgba(232,213,163,0.5); border-left:3px solid #b8860b;
    padding:12px 16px; border-radius:0 2px 2px 0; margin:18px 0;
    font-size:0.9rem; color:#2a1a0a; }
  .highlight strong { color:#8b3a0f; }
  .divider { text-align:center; margin:20px 0; color:#b8860b; letter-spacing:0.2em; font-size:0.7rem; }
  .contact-box { background:rgba(232,213,163,0.3); border:1px solid rgba(184,134,11,0.3);
    padding:16px; border-radius:2px; margin:16px 0; }
  .contact-box p { margin:4px 0; font-size:0.85rem; color:#4a2e10; }
  .contact-box strong { color:#8b3a0f; }
  .btn { display:block; width:fit-content; margin:20px auto; padding:12px 28px;
    background:linear-gradient(135deg,#5c2200,#8b3a0f); border:1px solid #b8860b;
    color:#d4a017; font-size:0.8rem; letter-spacing:0.15em; border-radius:2px;
    text-decoration:none; text-align:center; }
  .foot { background:linear-gradient(135deg,#3d1c00,#5c2e00,#3d1c00);
    padding:16px 32px; text-align:center; border-top:2px solid #b8860b; }
  .foot p { margin:0; color:rgba(232,213,163,0.65); font-size:0.7rem;
    font-style:italic; letter-spacing:0.08em; }
</style>
</head>
<body>
<div class="wrap">
  <div class="head">
    <span class="om">ॐ</span>
    <h1>AYM Yoga School</h1>
    <p>Indian Yoga Association · Rishikesh, Uttarakhand</p>
  </div>
  <div class="body">
    <p class="greeting">Namaste, <strong>${escapeHtml(name)}</strong> 🙏</p>

    <p class="para">
      Thank you for reaching out to AYM Yoga School. We have received your message
      and our team is reviewing your inquiry. We will respond within <strong>24 hours</strong>.
    </p>

    <div class="highlight">
      <strong>Your Inquiry:</strong> ${escapeHtml(subject)}<br/>
      <strong>Course Interest:</strong> ${escapeHtml(course || "General Inquiry")}
    </div>

    <p class="para">
      In the meantime, feel free to explore our courses, read student testimonials,
      or connect with us on WhatsApp for a quicker response.
    </p>

    <div class="divider">◆ &nbsp; Contact Us Directly &nbsp; ◆</div>

    <div class="contact-box">
      <p>📞 <strong>Phone:</strong> +91 75002 77709</p>
      <p>✉️ <strong>Email:</strong> aymindia@gmail.com</p>
      <p>🏫 <strong>Address:</strong> Upper Tapovan, Rishikesh, Uttarakhand – 249192</p>
      <p>🕘 <strong>Hours:</strong> 9:00 AM – 6:00 PM IST, Mon – Sat</p>
    </div>

    <a class="btn" href="https://wa.me/917500277709" target="_blank">
      💬 &nbsp; Connect on WhatsApp
    </a>

    <div class="divider">◆ &nbsp; ॐ &nbsp; ◆</div>

    <p class="para" style="text-align:center;font-style:italic;color:#7a5c2e;">
      "Yoga is the journey of the self, through the self, to the self."<br/>
      — Bhagavad Gita
    </p>
  </div>
  <div class="foot">
    <p>Indian Yoga Association · Affiliated with Yoga Certification Board, Ministry of AYUSH, Govt. of India</p>
  </div>
</div>
</body>
</html>`;
}

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

router.post("/", async (req, res) => {
  const { name, email, phone, subject, course, message } = req.body;

  /* 1. Validate */
  const errors = validateContact({ name, email, subject, message });
  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  try {
    await transporter.sendMail({
      from: `"AYM Yoga School Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      replyTo: email,
      subject: `🧘 New Inquiry: ${subject} — ${name}`,
      html: adminEmailHTML({ name, email, phone, subject, course, message }),
    });

    await transporter.sendMail({
      from: `"AYM Yoga School" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Namaste ${name} 🙏 — We received your message`,
      html: userEmailHTML({ name, course, subject }),
    });

    return res.status(200).json({
      success: true,
      message: "Your message has been sent. Check your email for confirmation.",
    });
  } catch (error) {
    console.error("Contact route error:", error);
    return res.status(500).json({
      success: false,
      message: "Email could not be sent. Please try again later.",
    });
  }
});

module.exports = router;
