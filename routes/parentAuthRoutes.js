const express = require('express');
const router = express.Router();
const { Resend } = require('resend');

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY || 're_SV7dfxV8_PrsREmG3JNQJWConFbGgEZch');

// In-memory OTP storage (replace with Redis/DB in production)
const OTP_STORE = new Map();

// Send Email OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    const nodemailer = require('nodemailer');
    
    // Create a transporter using Gmail (requires app password)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // App password, not regular password
      }
    });
    
    router.post('/send-otp', async (req, res) => {
      try {
        const { email } = req.body;
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Your Login OTP',
          html: `<p>Your OTP is: <strong>${otp}</strong></p>`
        });
    
        // Store OTP logic remains the same
      } catch (error) {
        console.error('Email send error:', error);
      }
    });
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

    // Send OTP via Resend
    const { data, error } = await resend.emails.send({
      from: 'Cadet Management System <noreply@yourdomain.com>',
      to: [email],
      subject: 'Your Login OTP',
      html: `<p>Your login OTP is: <strong>${otp}</strong></p>
             <p>This OTP will expire in 10 minutes.</p>`
    });

    if (error) {
      console.error('Resend Email Error:', error);
      return res.status(500).json({ message: 'Failed to send OTP', error });
    }

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('Send OTP Error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
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
      // For now, return a mock token
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
