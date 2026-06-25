const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const { sendThankYouEmail } = require('./emailService');
const { getDocumentLink } = require('./driveConfig');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from 'public' directory with proper headers
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filepath) => {
    if (filepath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
    if (filepath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// MongoDB Connection
const connectDB = async () => {
  try {
    // Log connection attempt (hide password in logs)
    const safeUri = process.env.MONGO_URI ? process.env.MONGO_URI.replace(/:[^:@]+@/, ':****@') : 'NOT SET';
    console.log('🔗 Attempting MongoDB connection:', safeUri);
    
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not set!');
    }

    // Use newer connection string format without deprecated options
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/pravesh-mitra');
    console.log('✅ MongoDB Connected Successfully');
    console.log('📊 Database:', mongoose.connection.name);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.error('Full error:', error);
    // Don't exit in serverless environment
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
    throw error; // Re-throw to handle in API routes
  }
};

// Student Response Schema
const responseSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  mobileNo: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  mhtCetScore: {
    type: Number,
    required: true
  },
  jeeScore: {
    type: Number,
    default: null
  },
  percentileRange: {
    type: String,
    required: true
  },
  branches: {
    type: [String],
    required: true
  },
  cities: {
    type: [String],
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

const Response = mongoose.model('Response', responseSchema);

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Submit Form API
app.post('/api/submit', async (req, res) => {
  try {
    console.log('📝 Form submission received');
    console.log('Environment check:', {
      hasMongoUri: !!process.env.MONGO_URI,
      hasGmailUser: !!process.env.GMAIL_USER,
      hasGmailPassword: !!process.env.GMAIL_APP_PASSWORD,
      nodeEnv: process.env.NODE_ENV
    });

    const { fullName, mobileNo, email, mhtCetScore, jeeScore, branches, cities, percentileRange } = req.body;

    // Validation
    if (!fullName || !mobileNo || !email || !mhtCetScore || !branches || !cities || !percentileRange) {
      console.error('❌ Validation failed: Missing required fields');
      return res.status(400).json({ 
        success: false, 
        message: 'Please fill all required fields' 
      });
    }

    // Get document link for the selected percentile range
    const documentInfo = getDocumentLink(percentileRange);
    
    if (!documentInfo) {
      console.error('❌ No document found for percentile range:', percentileRange);
    }

    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ MongoDB not connected, attempting to connect...');
      await connectDB();
    }

    // Create new response
    const newResponse = new Response({
      fullName,
      mobileNo,
      email,
      mhtCetScore: parseFloat(mhtCetScore),
      jeeScore: jeeScore ? parseFloat(jeeScore) : null,
      percentileRange,
      branches: Array.isArray(branches) ? branches : [branches],
      cities: Array.isArray(cities) ? cities : [cities]
    });

    await newResponse.save();
    console.log('✅ Data saved to MongoDB');

    // Send thank you email
    try {
      const emailResult = await sendThankYouEmail({
        fullName,
        email,
        mhtCetScore: parseFloat(mhtCetScore),
        jeeScore: jeeScore ? parseFloat(jeeScore) : null,
        percentileRange,
        branches: Array.isArray(branches) ? branches : [branches],
        cities: Array.isArray(cities) ? cities : [cities],
        documentLink: documentInfo ? documentInfo.link : null,
        documentName: documentInfo ? documentInfo.name : null
      });

      if (!emailResult.success) {
        console.warn('⚠️ Email failed to send:', emailResult.error);
      } else {
        console.log('✅ Email sent successfully');
      }
    } catch (emailError) {
      console.error('❌ Email error:', emailError.message);
      // Don't fail the request if email fails
    }

    res.status(201).json({ 
      success: true, 
      message: 'Response submitted successfully! Check your email for college list.',
      data: newResponse,
      documentLink: documentInfo ? documentInfo.link : null,
      documentName: documentInfo ? documentInfo.name : null,
      emailSent: true
    });
  } catch (error) {
    console.error('❌ Error in /api/submit:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get all responses (for admin/testing)
app.get('/api/responses', async (req, res) => {
  try {
    const responses = await Response.find().sort({ submittedAt: -1 });
    res.json({ success: true, data: responses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching responses' });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;

// For serverless deployment (Vercel)
if (process.env.VERCEL) {
  connectDB();
  module.exports = app;
} else {
  // For local development
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  });
}
