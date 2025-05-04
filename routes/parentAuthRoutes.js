const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// In-memory OTP storage (replace with Redis/DB in production)
const OTP_STORE = new Map();

// Create a transporter using Gmail (requires app password)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'prasadaswar6870@gmail.com',
    pass: 'bzff kutw mqsn oigi' // App password
  }
});

// Send Email OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Validate email
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with timestamp (expires in 10 minutes)
    OTP_STORE.set(email, {
      otp,
      timestamp: Date.now()
    });

    // Send OTP via Nodemailer
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Login OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your Login OTP</h2>
          <p>Your One-Time Password (OTP) is:</p>
          <h1 style="background-color: #f0f0f0; padding: 10px; text-align: center;">${otp}</h1>
          <p>This OTP will expire in 10 minutes.</p>
          <small>If you did not request this OTP, please ignore this email.</small>
        </div>
      `
    });

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ message: 'Failed to send OTP', error: error.message });
  }
});

// Verify Email OTP
router.post('/verify-otp', (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check if email and OTP are provided
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Retrieve stored OTP
    const storedOtpData = OTP_STORE.get(email);

    // Check if OTP exists and is valid
    if (!storedOtpData) {
      return res.status(400).json({ message: 'No OTP found for this email' });
    }

    // Check OTP expiration (10 minutes)
    const currentTime = Date.now();
    const otpAge = currentTime - storedOtpData.timestamp;
    if (otpAge > 10 * 60 * 1000) {
      OTP_STORE.delete(email);
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Verify OTP
    if (storedOtpData.otp === otp) {
      // Clear OTP after successful verification
      OTP_STORE.delete(email);

      // TODO: Implement user authentication logic
      res.status(200).json({
        message: 'OTP verified successfully',
        token: 'mock_parent_auth_token'
      });
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (err) {
    console.error('Verify OTP Error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

module.exports = router;


// Verify Email OTP
const jwt = require('jsonwebtoken');
const { Cadet, Parent } = require('../models');

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check if email and OTP are provided
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Retrieve stored OTP
    const storedOtpData = OTP_STORE.get(email);

    // Check if OTP exists and is valid
    if (!storedOtpData) {
      return res.status(400).json({ message: 'No OTP found for this email' });
    }

    // Check OTP expiration (10 minutes)
    const currentTime = Date.now();
    const otpAge = currentTime - storedOtpData.timestamp;
    if (otpAge > 10 * 60 * 1000) {
      OTP_STORE.delete(email);
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Verify OTP
    if (storedOtpData.otp === otp) {
      // Clear OTP after successful verification
      OTP_STORE.delete(email);

      // Find cadet with this email
      const cadet = await Cadet.findOne({ where: { emailId: email } });
      
      if (!cadet) {
        return res.status(404).json({ message: 'No cadet found with this email' });
      }

      // Find or create parent record
      const [parent, created] = await Parent.findOrCreate({
        where: { email },
        defaults: {
          email,
          cadetId: cadet.id,
          fullName: cadet.parentsDetails || 'Parent'
        }
      });

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: parent.id,
          email: parent.email, 
          cadetId: parent.cadetId 
        }, 
        process.env.JWT_SECRET || 'your_jwt_secret_for_parent_auth', 
        { expiresIn: '1h' }
      );

      console.log('Generated Token:', token);
      console.log('Parent Details:', {
        id: parent.id,
        email: parent.email,
        cadetId: parent.cadetId
      });

      res.status(200).json({
        message: 'OTP verified successfully',
        token,
        parentId: parent.id,
        cadetId: cadet.id
      });
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (err) {
    console.error('Verify OTP Error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

module.exports = router;
