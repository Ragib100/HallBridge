const express = require("express");
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcrypt");
require("dotenv").config({ path: ".env.email" });

const app = express();
app.use(express.json());

// 🔒 Rate limit (VERY important)
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 30,
  })
);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

app.post("/send-email", async (req, res) => {
  const { to, subject, html, text, secret } = req.body;

  // 🔐 API authentication
  const secret_matched = await bcrypt.compare(process.env.EMAIL_API_SECRET, secret);
  console.log("🔐 Secret matched:", secret_matched);
  if (!secret || !secret_matched) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  // Validate required fields
  if (!to || !subject || !html) {
    return res.status(400).json({ 
      success: false, 
      message: "Missing required fields: to, subject, html" 
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(to)) {
    return res.status(400).json({ 
      success: false, 
      message: "Invalid email format" 
    });
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
      text: text || subject, // Fallback to subject if no text provided
    });

    console.log(`✅ Email sent successfully to: ${to}`);
    res.json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error("❌ Email sending failed:", err);
    res.status(500).json({ 
      success: false, 
      message: "Failed to send email",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    service: "HallBridge Email Server",
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`📧 HallBridge Email Server running on port ${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
  console.log(`   Email endpoint: http://localhost:${PORT}/send-email`);
});
