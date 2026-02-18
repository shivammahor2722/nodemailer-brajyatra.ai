const express = require("express");
const transporter = require("../config/mail");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const templatePath = path.join(__dirname, "..", "templates", "email.html");
let emailTemplate = null;
try {
  emailTemplate = fs.readFileSync(templatePath, "utf8");
} catch (err) {
  emailTemplate = null;
}

function renderTemplate(data) {
  if (!emailTemplate) {
    return `
      <h2>${data.subject}</h2>
      <p>${data.message}</p>
      <br/>
      <p>Happy Journey 🌍</p>
    `;
  }

  let out = emailTemplate;
  const map = {
    subject: data.subject || "",
    message: data.message || "",
    recipient: data.recipient || "",
    siteName: data.siteName || process.env.SITE_NAME || "Brajyatra.ai",
  };

  Object.keys(map).forEach((key) => {
    const re = new RegExp("{{\\s*" + key + "\\s*}}", "g");
    out = out.replace(re, map[key]);
  });

  return out;
}

router.post("/send", async (req, res) => {
  const { to, subject, message, name } = req.body;

  try {
    const html = renderTemplate({
      subject,
      message,
      recipient: name || "",
      siteName: process.env.SITE_NAME || "Brajyatra",
    });

    await transporter.sendMail({
      from: `"${process.env.SITE_NAME || "Brajyatra"}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
