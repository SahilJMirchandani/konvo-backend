const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

const otpStore = {};

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Konvo OTP',
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    });
    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send OTP', error: err.message });
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: 'Email and OTP required' });

  const record = otpStore[email];
  if (!record) return res.status(400).json({ message: 'OTP not found, request a new one' });
  if (Date.now() > record.expiresAt) return res.status(400).json({ message: 'OTP expired' });
  if (record.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

  delete otpStore[email];

  let user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (user.rows.length === 0) {
    user = await pool.query('INSERT INTO users (email) VALUES ($1) RETURNING *', [email]);
  }

  const token = jwt.sign({ id: user.rows[0].id, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: user.rows[0] });
};

module.exports = { sendOTP, verifyOTP };
