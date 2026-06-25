const nodemailer = require('nodemailer');

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map();

// OTP expiry time (5 minutes)
const OTP_EXPIRY = 5 * 60 * 1000;

/**
 * Generate a 6-digit OTP
 */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Store OTP with expiry time
 */
function storeOTP(identifier, otp, type) {
  const key = `${type}_${identifier}`;
  otpStore.set(key, {
    otp: otp,
    expiresAt: Date.now() + OTP_EXPIRY,
    attempts: 0
  });
}

/**
 * Verify OTP
 */
function verifyOTP(identifier, otp, type) {
  const key = `${type}_${identifier}`;
  const stored = otpStore.get(key);

  if (!stored) {
    return { success: false, message: 'OTP not found or expired' };
  }

  // Check expiry
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(key);
    return { success: false, message: 'OTP expired. Please request a new one.' };
  }

  // Check attempts (max 3)
  if (stored.attempts >= 3) {
    otpStore.delete(key);
    return { success: false, message: 'Too many attempts. Please request a new OTP.' };
  }

  // Verify OTP
  if (stored.otp === otp) {
    otpStore.delete(key);
    return { success: true, message: 'OTP verified successfully' };
  } else {
    stored.attempts++;
    return { success: false, message: 'Invalid OTP. Please try again.' };
  }
}

/**
 * Send OTP via Email
 */
async function sendEmailOTP(email, name) {
  try {
    const otp = generateOTP();
    storeOTP(email, otp, 'email');

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Pravesh Mitra" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Email Verification - Pravesh Mitra',
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #667eea;
    }
    .otp-box {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 8px;
      text-align: center;
      margin: 25px 0;
    }
    .otp {
      font-size: 36px;
      font-weight: bold;
      letter-spacing: 8px;
      margin: 15px 0;
    }
    .warning {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      color: #718096;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🎓 Pravesh Mitra</div>
      <p>Email Verification</p>
    </div>

    <p>Dear <strong>${name}</strong>,</p>
    <p>Your OTP for email verification is:</p>

    <div class="otp-box">
      <div style="font-size: 16px; margin-bottom: 10px;">Your OTP Code</div>
      <div class="otp">${otp}</div>
      <div style="font-size: 14px; margin-top: 10px; opacity: 0.9;">Valid for 5 minutes</div>
    </div>

    <div class="warning">
      <strong>⚠️ Security Note:</strong>
      <ul style="margin: 10px 0;">
        <li>Never share this OTP with anyone</li>
        <li>This OTP expires in 5 minutes</li>
        <li>Maximum 3 verification attempts allowed</li>
      </ul>
    </div>

    <p>If you didn't request this OTP, please ignore this email.</p>

    <div class="footer">
      <p>© ${new Date().getFullYear()} Pravesh Mitra. All rights reserved.</p>
      <p>MHT-CET College Admission Counselling</p>
    </div>
  </div>
</body>
</html>
      `
    };

    await transporter.sendMail(mailOptions);
    
    return {
      success: true,
      message: 'OTP sent to your email successfully',
      expiresIn: OTP_EXPIRY / 1000 // seconds
    };
  } catch (error) {
    console.error('Email OTP error:', error);
    return {
      success: false,
      message: 'Failed to send OTP. Please try again.'
    };
  }
}

/**
 * Send OTP via SMS using Fast2SMS (Free tier)
 * Alternative: You can use MSG91, Twilio, or any other SMS service
 */
async function sendSMSOTP(mobile, name) {
  try {
    const otp = generateOTP();
    storeOTP(mobile, otp, 'sms');

    // Check if Fast2SMS API key is configured
    if (!process.env.FAST2SMS_API_KEY) {
      console.warn('SMS service not configured. Using mock OTP.');
      // For development/testing without SMS service
      console.log(`Mock SMS OTP for ${mobile}: ${otp}`);
      return {
        success: true,
        message: 'OTP generated (SMS service not configured)',
        mockOTP: process.env.NODE_ENV === 'development' ? otp : undefined
      };
    }

    // Fast2SMS API call
    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'authorization': process.env.FAST2SMS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        route: 'otp',
        variables_values: otp,
        flash: 0,
        numbers: mobile
      })
    });

    const data = await response.json();

    if (data.return) {
      return {
        success: true,
        message: 'OTP sent to your mobile successfully',
        expiresIn: OTP_EXPIRY / 1000
      };
    } else {
      throw new Error(data.message || 'SMS sending failed');
    }
  } catch (error) {
    console.error('SMS OTP error:', error);
    return {
      success: false,
      message: 'Failed to send SMS. Please try again or verify email only.'
    };
  }
}

/**
 * Resend OTP
 */
async function resendOTP(identifier, type) {
  const key = `${type}_${identifier}`;
  
  // Delete old OTP
  otpStore.delete(key);
  
  // Generate and send new OTP
  if (type === 'email') {
    return await sendEmailOTP(identifier, 'User');
  } else if (type === 'sms') {
    return await sendSMSOTP(identifier, 'User');
  }
  
  return { success: false, message: 'Invalid type' };
}

module.exports = {
  sendEmailOTP,
  sendSMSOTP,
  verifyOTP,
  resendOTP
};
