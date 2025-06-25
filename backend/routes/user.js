// backend/routes/user.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const nodemailer = require("nodemailer");

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET;

// SendGrid or Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail", // or 'SendGrid'
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  console.log("📥 Received:", { name, email, password });

  if (!name || !email || !password) {
    console.log("❌ Missing fields");
    return res.status(400).json({ error: "All fields required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ Email exists");
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });
    await user.save();
    console.log("✅ User saved successfully");

    res.status(201).json({ message: "User registered" });
  } catch (err) {
    console.error("🔥 Registration failed:", err.message);
    res.status(500).json({ error: "Registration failed" });
  }
});

// 🔐 Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, JWT_SECRET);
  res.json({ token });
});

// ✉️ Forgot Password
router.post("/forgot", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "15m" });

  const resetLink = `http://localhost:3000/reset-password/${token}`;

  await transporter.sendMail({
    from: `"IntelliBlog Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🔐 Reset your password",
    html: `<p>Click below to reset your password:</p>
           <a href="${resetLink}">${resetLink}</a>`,
  });

  res.json({ message: "Reset link sent to your email." });
});

// 🔄 Reset Password
router.post("/reset/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(decoded.id, { password: hashed });
    res.json({ message: "Password updated successfully." });
  } catch (err) {
    res.status(400).json({ error: "Invalid or expired token" });
  }
});

module.exports = router;
