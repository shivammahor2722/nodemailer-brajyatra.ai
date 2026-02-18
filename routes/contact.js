const express = require('express');
const transporter = require('../config/mail');

const router = express.Router();

// Public: visitor sends message, backend emails admin (no storage, no auth)
router.post('/send', async (req, res) => {
  const { name, email, message } = req.body;
  if (!email || !message) return res.status(400).json({ error: 'Email and message required' });

  try {
    await transporter.sendMail({
      from: `"${name || 'Visitor'}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `Contact Form: ${name || email}`,
      html: `<p>${message}</p><p>From: ${email}</p>`
    });

    res.json({ success: true, message: 'Message sent to admin' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
