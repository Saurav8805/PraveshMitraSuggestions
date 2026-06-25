const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.GMAIL_USER || process.env.EMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASSWORD,
    },
  });
};

// Generate Thank You Email HTML
const generateThankYouEmail = (userData) => {
  const { fullName, mhtCetScore, jeeScore, branches, cities } = userData;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f4f4f4;
    }
    .container {
      background: white;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo-text {
      font-size: 32px;
      font-weight: 800;
      color: #667eea;
      margin-bottom: 5px;
    }
    .tagline {
      color: #718096;
      font-size: 14px;
    }
    .success-icon {
      background: #48bb78;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 20px auto;
      font-size: 32px;
      color: white;
    }
    .title {
      font-size: 24px;
      font-weight: bold;
      color: #1a202c;
      text-align: center;
      margin-bottom: 20px;
    }
    .greeting {
      text-align: center;
      color: #4a5568;
      margin-bottom: 30px;
    }
    .summary-box {
      background: #f7fafc;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      margin: 25px 0;
    }
    .summary-title {
      font-size: 14px;
      font-weight: bold;
      color: #718096;
      margin-bottom: 15px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e2e8f0;
    }
    .summary-row:last-child {
      border-bottom: none;
    }
    .summary-label {
      font-weight: 600;
      color: #4a5568;
    }
    .summary-value {
      color: #2d3748;
      text-align: right;
      max-width: 60%;
    }
    .score {
      color: #667eea;
      font-weight: bold;
      font-size: 18px;
    }
    .next-steps {
      background: #fff5f5;
      border-left: 4px solid #f56565;
      padding: 20px;
      margin: 25px 0;
      border-radius: 4px;
    }
    .next-steps-title {
      font-size: 18px;
      font-weight: bold;
      color: #1a202c;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
    }
    .step {
      padding: 12px 0;
      display: flex;
      align-items: flex-start;
    }
    .step-number {
      background: #667eea;
      color: white;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      margin-right: 12px;
      flex-shrink: 0;
    }
    .step-content h4 {
      margin: 0 0 5px 0;
      color: #2d3748;
      font-size: 16px;
    }
    .step-content p {
      margin: 0;
      color: #718096;
      font-size: 14px;
    }
    .plans-section {
      margin: 30px 0;
    }
    .plans-title {
      font-size: 22px;
      font-weight: bold;
      text-align: center;
      color: #1a202c;
      margin-bottom: 25px;
    }
    .plan-card {
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 15px;
      position: relative;
    }
    .plan-card.featured {
      border-color: #667eea;
      background: linear-gradient(to bottom, #f0f4ff 0%, white 100%);
    }
    .plan-badge {
      position: absolute;
      top: -12px;
      right: 20px;
      background: #667eea;
      color: white;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
    }
    .plan-name {
      font-size: 20px;
      font-weight: bold;
      color: #1a202c;
      margin-bottom: 5px;
    }
    .plan-subtitle {
      color: #718096;
      font-size: 14px;
      margin-bottom: 15px;
    }
    .plan-price {
      font-size: 32px;
      font-weight: bold;
      color: #667eea;
      margin-bottom: 15px;
    }
    .plan-price span {
      font-size: 14px;
      color: #718096;
      font-weight: normal;
    }
    .plan-features {
      list-style: none;
      padding: 0;
      margin: 15px 0;
    }
    .plan-features li {
      padding: 6px 0;
      color: #4a5568;
      font-size: 14px;
    }
    .plan-features li:before {
      content: "✓";
      color: #48bb78;
      font-weight: bold;
      margin-right: 8px;
    }
    .plan-button {
      display: block;
      width: 100%;
      padding: 12px;
      background: #667eea;
      color: white;
      text-align: center;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      margin-top: 15px;
    }
    .contact-section {
      background: #f7fafc;
      border-radius: 8px;
      padding: 25px;
      text-align: center;
      margin: 30px 0;
    }
    .contact-title {
      font-size: 20px;
      font-weight: bold;
      color: #1a202c;
      margin-bottom: 15px;
    }
    .contact-links {
      display: flex;
      justify-content: center;
      gap: 20px;
      flex-wrap: wrap;
    }
    .contact-link {
      display: inline-flex;
      align-items: center;
      padding: 10px 20px;
      background: white;
      border-radius: 6px;
      text-decoration: none;
      color: #667eea;
      font-weight: 600;
      border: 2px solid #667eea;
    }
    .cta-button {
      display: block;
      width: 100%;
      max-width: 400px;
      margin: 30px auto;
      padding: 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-align: center;
      text-decoration: none;
      border-radius: 8px;
      font-weight: bold;
      font-size: 16px;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      color: #718096;
      font-size: 12px;
    }
    .footer p {
      margin: 5px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="logo-text">प्रवेश मित्र</div>
      <div class="tagline">ऍडमिशन तुमचं, जबाबदारी आमची!</div>
    </div>

    <!-- Success Icon -->
    <div class="success-icon">✓</div>

    <!-- Title -->
    <h1 class="title">Thank You for Your Interest!</h1>
    <p class="greeting">Dear <strong>${fullName}</strong>, we have successfully received your information.</p>

    <!-- Submission Summary -->
    <div class="summary-box">
      <div class="summary-title">📋 YOUR SUBMISSION SUMMARY</div>
      
      <div class="summary-row">
        <span class="summary-label">Name</span>
        <span class="summary-value">${fullName}</span>
      </div>
      
      <div class="summary-row">
        <span class="summary-label">MHT-CET Score</span>
        <span class="summary-value score">${mhtCetScore}</span>
      </div>
      
      ${jeeScore ? `
      <div class="summary-row">
        <span class="summary-label">JEE Score</span>
        <span class="summary-value score">${jeeScore}</span>
      </div>
      ` : ''}
      
      <div class="summary-row">
        <span class="summary-label">Branches</span>
        <span class="summary-value">${branches.join(', ')}</span>
      </div>
      
      <div class="summary-row">
        <span class="summary-label">Cities</span>
        <span class="summary-value">${cities.join(', ')}</span>
      </div>
    </div>

    <!-- What Happens Next -->
    <div class="next-steps">
      <div class="next-steps-title">🚀 What Happens Next?</div>
      
      <div class="step">
        <div class="step-number">1</div>
        <div class="step-content">
          <h4>Choose Your Plan</h4>
          <p>Select a counselling package that fits your needs.</p>
        </div>
      </div>
      
      <div class="step">
        <div class="step-number">2</div>
        <div class="step-content">
          <h4>Complete Payment</h4>
          <p>Secure checkout via Cashfree Gateway.</p>
        </div>
      </div>
      
      <div class="step">
        <div class="step-number">3</div>
        <div class="step-content">
          <h4>Expert Counselling</h4>
          <p>We'll call you within 24 hours.</p>
        </div>
      </div>
    </div>

    <!-- Plans Section -->
    <div class="plans-section">
      <h2 class="plans-title">Choose Your Counselling Plan</h2>

      <!-- Basic Plan -->
      <div class="plan-card">
        <div class="plan-name">Basic Plan</div>
        <div class="plan-subtitle">College Discovery Package</div>
        <div class="plan-price">₹499 <span>/ one-time</span></div>
        <ul class="plan-features">
          <li>Personalized College List</li>
          <li>Dream / Target / Safe Colleges</li>
          <li>Branch Recommendations</li>
          <li>Cutoff Analysis</li>
          <li>College Comparison Sheet</li>
          <li>PDF Report</li>
        </ul>
        <a href="#" class="plan-button">Select Basic Plan →</a>
      </div>

      <!-- Standard Plan -->
      <div class="plan-card featured">
        <div class="plan-badge">Most Popular</div>
        <div class="plan-name">Standard Plan</div>
        <div class="plan-subtitle">Admission Strategy Package</div>
        <div class="plan-price">₹999 <span>/ one-time</span></div>
        <ul class="plan-features">
          <li>Everything in Basic Plan</li>
          <li>1-on-1 Counseling Call (30-45 mins)</li>
          <li>Branch Selection Guidance</li>
          <li>Option Form Strategy</li>
          <li>College vs Branch Decision Support</li>
          <li>Real Insights from Seniors</li>
          <li>WhatsApp Support for 7 Days</li>
        </ul>
        <a href="#" class="plan-button">Select Standard Plan →</a>
      </div>

      <!-- Premium Plan -->
      <div class="plan-card featured">
        <div class="plan-badge">Best Value</div>
        <div class="plan-name">Premium Plan</div>
        <div class="plan-subtitle">Complete CAP Support</div>
        <div class="plan-price">₹1,999 <span>/ one-time</span></div>
        <ul class="plan-features">
          <li>Everything in Standard Plan</li>
          <li>Support Throughout All CAP Rounds</li>
          <li>Option Form Review</li>
          <li>Round-wise Guidance</li>
          <li>Freeze / Betterment Advice</li>
          <li>Spot Round Guidance</li>
          <li>Priority WhatsApp Support</li>
          <li>Multiple Counseling Sessions</li>
        </ul>
        <a href="#" class="plan-button">Select Premium Plan →</a>
      </div>
    </div>

    <!-- CTA Button -->
    <a href="#" class="cta-button">View All Plans & Get Started →</a>

    <!-- Contact Section -->
    <div class="contact-section">
      <div class="contact-title">Need Help? We're Here!</div>
      <div class="contact-links">
        <a href="tel:+919529679073" class="contact-link">📞 ${process.env.CONTACT_PHONE || '+91 95296 79073'}</a>
        <a href="${process.env.CONTACT_WHATSAPP || 'https://wa.me/919529679073'}" class="contact-link">💬 WhatsApp</a>
        <a href="mailto:${process.env.CONTACT_EMAIL || 'info@praveshmitra.online'}" class="contact-link">✉️ Email</a>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>© 2026 Pravesh Mitra</strong> — Your Trusted Admission Partner</p>
      <p>Chhatrapati Sambhaji Nagar, Maharashtra, India</p>
      <p style="margin-top: 15px; color: #a0aec0;">This is an automated email. Please do not reply to this message.</p>
    </div>
  </div>
</body>
</html>
  `;
};

// Send Thank You Email
const sendThankYouEmail = async (userData) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || `Pravesh Mitra <${process.env.GMAIL_USER}>`,
      to: userData.email,
      subject: 'Thank You for Your Interest - Pravesh Mitra',
      html: generateThankYouEmail(userData),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendThankYouEmail };
