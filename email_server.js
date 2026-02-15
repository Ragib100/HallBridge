import express from "express";
import nodemailer from "nodemailer";
import rateLimit from "express-rate-limit";
import sanitizeHtml from "sanitize-html";
import dotenv from "dotenv";
dotenv.config({ path: ".env.email" });

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
  const secret_matched = process.env.EMAIL_API_SECRET === secret;
  console.log("🔐 Secret matched:", secret_matched);
  if (!secret || !secret_matched) {
    console.log(to, subject, html, text)
    console.log(secret, process.env.EMAIL_API_SECRET)
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  // Validate required fields
  if (!to || !subject || !html) {
    return res.status(400).json({ 
      success: false, 
      message: "Missing required fields: to, subject, html" 
    });
  }

  // Validate email format (safer regex to prevent ReDoS)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(to)) {
    return res.status(400).json({ 
      success: false, 
      message: "Invalid email format" 
    });
  }

  // Sanitize HTML content to prevent XSS attacks
  const sanitizedHtml = sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img', 'h1', 'h2', 'h3', 'table', 'thead', 'tbody', 'tr', 'td', 'th', 'html', 'head', 'body', 'meta', 'title'
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      '*': ['style', 'class'],
      'table': ['role', 'width', 'cellpadding', 'cellspacing', 'border', 'align', 'bgcolor'],
      'tr': ['valign', 'align', 'bgcolor'],
      'td': ['width', 'height', 'valign', 'align', 'colspan', 'rowspan', 'bgcolor'],
      'th': ['width', 'height', 'valign', 'align', 'colspan', 'rowspan', 'bgcolor'],
      'img': ['src', 'alt', 'width', 'height', 'border'],
      'a': ['href', 'target', 'rel'],
      'meta': ['charset', 'name', 'content'],
      'div': ['style', 'class', 'align']
    },
    allowedStyles: {
      '*': {
        'color': [/^#?[0-9a-fA-F]{3,6}$/],
        'background-color': [/^#?[0-9a-fA-F]{3,6}$/],
        'text-align': [/^(left|right|center|justify)$/],
        'font-size': [/^\d+(?:px|em|rem|%|pt)$/],
        'font-weight': [/^(bold|normal|\d{3})$/],
        'font-family': [/.*/],
        'padding': [/^\d+(?:px|em|rem|%)(?:\s+\d+(?:px|em|rem|%))*$/],
        'margin': [/^\d+(?:px|em|rem|%)(?:\s+\d+(?:px|em|rem|%))*$/],
        'border': [/.*/],
        'border-radius': [/^\d+(?:px|em|rem|%)(?:\s+\d+(?:px|em|rem|%))*$/],
        'border-left': [/.*/],
        'border-right': [/.*/],
        'border-top': [/.*/],
        'border-bottom': [/.*/],
        'line-height': [/^\d+(?:\.\d+)?$/],
        'width': [/^\d+(?:px|em|rem|%)$/],
        'height': [/^\d+(?:px|em|rem|%)$/],
        'max-width': [/^\d+(?:px|em|rem|%)$/],
        'display': [/^(block|inline|inline-block|none|table|table-cell)$/],
        'vertical-align': [/^(top|middle|bottom|baseline)$/],
        'text-decoration': [/^(none|underline|line-through)$/],
        'letter-spacing': [/^\d+(?:px|em|rem)$/],
        'opacity': [/^\d*\.?\d+$/]
      }
    },
    // Allow data URIs for images (commonly used in email templates)
    allowedSchemes: ['http', 'https', 'mailto', 'data'],
    allowProtocolRelative: false
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html: sanitizedHtml,
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
