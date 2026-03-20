const nodemailer = require("nodemailer");

exports.sendEmail = async (req, res) => {
  try {
    const data = req.body;

    // ── Basic validation ────────────────────────────────────────────
    if (!data.fullName || !data.email || !data.phone || !data.course) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing: fullName, email, phone, course",
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ── Helpers ─────────────────────────────────────────────────────
    const formatDate = (d) => {
      if (!d) return "—";
      const date = new Date(d);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    };

    const row = (label, value) =>
      value
        ? `<tr>
            <td style="padding:10px 16px;font-size:13px;color:#8a7560;font-weight:600;
                       white-space:nowrap;width:170px;vertical-align:top;
                       border-bottom:1px solid #f5ede0;">${label}</td>
            <td style="padding:10px 16px;font-size:14px;color:#2c1f0f;
                       border-bottom:1px solid #f5ede0;">${value}</td>
          </tr>`
        : "";

    // ── Email to admin ───────────────────────────────────────────────
    const adminHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>New Registration – AYM Yoga School</title>
</head>
<body style="margin:0;padding:0;background:#fdf6ee;font-family:'Georgia',serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf6ee;padding:32px 0;">
    <tr><td align="center">
      <table width="620" cellpadding="0" cellspacing="0"
             style="background:#ffffff;border-radius:12px;
                    box-shadow:0 4px 24px rgba(160,100,30,0.12);overflow:hidden;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#7b3a00 0%,#c8721a 60%,#e8a030 100%);
                     padding:40px 32px;text-align:center;">
            <p style="margin:0 0 6px;font-size:28px;color:rgba(255,255,255,0.35);
                      letter-spacing:6px;">ॐ</p>
            <h1 style="margin:0;font-size:22px;color:#fff;letter-spacing:2px;
                       font-weight:400;text-transform:uppercase;">
              AYM Yoga School
            </h1>
            <p style="margin:6px 0 0;font-size:12px;color:rgba(255,255,255,0.7);
                      letter-spacing:3px;text-transform:uppercase;">
              Rishikesh · India
            </p>
            <div style="margin:20px auto 0;width:60px;height:1px;background:rgba(255,255,255,0.3);"></div>
            <p style="margin:16px 0 0;font-size:18px;color:#ffe5b0;font-weight:600;">
              🎉 New Course Registration
            </p>
          </td>
        </tr>

        <!-- Alert Banner -->
        <tr>
          <td style="background:#fff8ee;border-left:4px solid #e07b00;
                     padding:14px 24px;font-size:13px;color:#7b3a00;">
            <strong>Action required:</strong> A new student has submitted a registration form.
            Please review their details below and follow up within 24 hours.
          </td>
        </tr>

        <!-- Section: Personal Info -->
        <tr>
          <td style="padding:24px 24px 0;">
            <p style="margin:0 0 8px;font-size:11px;color:#c8721a;letter-spacing:3px;
                      text-transform:uppercase;font-weight:600;">Personal Information</p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 24px;">
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="border:1px solid #f0e0c8;border-radius:8px;overflow:hidden;">
              ${row("Full Name", data.fullName)}
              ${row("Email", `<a href="mailto:${data.email}" style="color:#c8721a;text-decoration:none;">${data.email}</a>`)}
              ${row("Phone", `<a href="tel:${data.phone}" style="color:#c8721a;text-decoration:none;">${data.phone}</a>`)}
              ${row("Birth Date", formatDate(data.birthDate))}
              ${row("Gender", data.gender)}
              ${row("Nationality", data.nationality)}
              ${row("Country", data.country)}
              ${row("Address", data.address)}
            </table>
          </td>
        </tr>

        <!-- Section: Course Info -->
        <tr>
          <td style="padding:24px 24px 0;">
            <p style="margin:0 0 8px;font-size:11px;color:#c8721a;letter-spacing:3px;
                      text-transform:uppercase;font-weight:600;">Course Details</p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 24px;">
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="border:1px solid #f0e0c8;border-radius:8px;overflow:hidden;">
              ${row("Course Applied", `<strong style="color:#7b3a00;">${data.course}</strong>`)}
              ${row("Location", data.location)}
              ${row("Start Date", formatDate(data.startDate))}
              ${row("End Date", formatDate(data.endDate))}
              ${row("Coupon Code", data.coupon || "None")}
              ${row("How They Found Us", data.howKnow)}
            </table>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="padding:28px 24px;text-align:center;">
            <a href="mailto:${data.email}?subject=Your AYM Yoga Registration – ${encodeURIComponent(data.course)}"
               style="display:inline-block;background:linear-gradient(135deg,#c8721a,#e8a030);
                      color:#fff;text-decoration:none;padding:14px 32px;border-radius:50px;
                      font-size:14px;font-weight:600;letter-spacing:1px;">
              ✉️ Reply to ${data.fullName.split(" ")[0]}
            </a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#fdf6ee;padding:20px 24px;text-align:center;
                     border-top:1px solid #f0e0c8;">
            <p style="margin:0;font-size:12px;color:#b0956e;">
              AYM Yoga School · Rishikesh, India · Yoga Alliance USA Certified
            </p>
            <p style="margin:6px 0 0;font-size:11px;color:#c8b89a;">
              This email was auto-generated from the registration form on your website.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    // ── Confirmation email to student ────────────────────────────────
    const studentHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Registration Confirmed – AYM Yoga School</title>
</head>
<body style="margin:0;padding:0;background:#fdf6ee;font-family:'Georgia',serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf6ee;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0"
             style="background:#ffffff;border-radius:12px;
                    box-shadow:0 4px 24px rgba(160,100,30,0.12);overflow:hidden;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#7b3a00 0%,#c8721a 60%,#e8a030 100%);
                     padding:48px 32px;text-align:center;">
            <p style="margin:0 0 4px;font-size:36px;color:rgba(255,255,255,0.4);">ॐ</p>
            <h1 style="margin:0;font-size:20px;color:#fff;letter-spacing:3px;
                       font-weight:400;text-transform:uppercase;">
              AYM Yoga School
            </h1>
            <p style="margin:6px 0 24px;font-size:11px;color:rgba(255,255,255,0.65);
                      letter-spacing:3px;text-transform:uppercase;">
              Rishikesh, India
            </p>
            <p style="margin:0;font-size:26px;color:#ffe5b0;">
              Namaste, ${data.fullName.split(" ")[0]} 🙏
            </p>
            <p style="margin:10px 0 0;font-size:15px;color:rgba(255,255,255,0.85);">
              Your registration has been received
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 32px;">
            <p style="margin:0 0 20px;font-size:15px;color:#3d2b10;line-height:1.7;">
              Thank you for choosing <strong>AYM Yoga School</strong> for your yoga journey.
              We have received your application for the
              <strong style="color:#c8721a;">${data.course}</strong>
              and our team will be in touch with you shortly to confirm your enrollment.
            </p>

            <!-- Summary card -->
            <div style="background:#fdf6ee;border-radius:10px;padding:24px;
                        border:1px solid #f0e0c8;margin:24px 0;">
              <p style="margin:0 0 16px;font-size:11px;color:#c8721a;letter-spacing:3px;
                        text-transform:uppercase;font-weight:600;">Your Registration Summary</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${row("Course", `<strong>${data.course}</strong>`)}
                ${row("Location", data.location)}
                ${data.startDate ? row("Start Date", formatDate(data.startDate)) : ""}
                ${data.endDate ? row("End Date", formatDate(data.endDate)) : ""}
              </table>
            </div>

            <p style="margin:0 0 12px;font-size:14px;color:#3d2b10;line-height:1.7;">
              In the meantime, if you have any questions, feel free to reply to this email
              or reach us directly.
            </p>

            <p style="margin:24px 0 0;font-size:15px;color:#7b3a00;font-style:italic;">
              "Yoga is the journey of the self, through the self, to the self."
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#fdf6ee;padding:24px 32px;text-align:center;
                     border-top:1px solid #f0e0c8;">
            <p style="margin:0;font-size:11px;color:#c8721a;letter-spacing:2px;
                      text-transform:uppercase;">
              Yoga Alliance USA · Ministry of AYUSH · YCB Certified
            </p>
            <p style="margin:8px 0 0;font-size:12px;color:#b0956e;">
              AYM Yoga School · Rishikesh, Uttarakhand, India
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    // ── Send both emails ─────────────────────────────────────────────
    await transporter.sendMail({
      from: `"AYM Yoga School" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `📋 New Registration: ${data.fullName} – ${data.course}`,
      html: adminHtml,
    });

    await transporter.sendMail({
      from: `"AYM Yoga School" <${process.env.EMAIL_USER}>`,
      to: data.email,
      subject: `Namaste ${data.fullName.split(" ")[0]} 🙏 – Registration Received`,
      html: studentHtml,
    });

    res.status(200).json({
      success: true,
      message: "Emails sent successfully",
    });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({
      success: false,
      message: "Email sending failed",
      error: error.message,
    });
  }
};