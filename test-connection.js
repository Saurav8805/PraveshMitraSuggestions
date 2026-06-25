// Test MongoDB Connection
require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔍 Testing MongoDB Connection...\n');
console.log('MongoDB URI:', process.env.MONGO_URI ? '✅ Found in .env' : '❌ Not Found');
console.log('Gmail User:', process.env.GMAIL_USER ? '✅ Found in .env' : '❌ Not Found');
console.log('Gmail Password:', process.env.GMAIL_APP_PASSWORD ? '✅ Found in .env' : '❌ Not Found');

const testConnection = async () => {
  try {
    console.log('\n⏳ Connecting to MongoDB Atlas...');
    
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB Connected Successfully!');
    console.log('📊 Database:', mongoose.connection.name || 'default');
    console.log('📝 Ready State:', mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Not Connected ❌');

    // Get collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📂 Collections in database:');
    if (collections.length === 0) {
      console.log('   (No collections yet - will be created on first form submission)');
    } else {
      collections.forEach(col => {
        console.log(`   - ${col.name}`);
      });
    }

    // Count documents in responses collection
    try {
      const Response = mongoose.model('Response', new mongoose.Schema({
        fullName: String,
        email: String,
        submittedAt: Date
      }));
      
      const count = await Response.countDocuments();
      console.log(`\n📊 Total responses stored: ${count}`);
      
      if (count > 0) {
        const latest = await Response.findOne().sort({ submittedAt: -1 });
        console.log('📝 Latest submission:');
        console.log(`   Name: ${latest.fullName}`);
        console.log(`   Email: ${latest.email}`);
        console.log(`   Date: ${latest.submittedAt}`);
      }
    } catch (err) {
      console.log('\n📊 No responses collection yet (will be created on first submission)');
    }

    console.log('\n✅ Connection test completed successfully!');
    console.log('🎉 Your MongoDB Atlas is ready to store form data!\n');

  } catch (error) {
    console.error('\n❌ MongoDB Connection Error:');
    console.error('Error:', error.message);
    
    if (error.message.includes('Authentication')) {
      console.log('\n🔧 Fix: Check username and password in .env file');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('\n🔧 Fix: Check internet connection and MongoDB URI');
    } else if (error.message.includes('IP')) {
      console.log('\n🔧 Fix: Whitelist your IP in MongoDB Atlas → Network Access');
    }
  } finally {
    await mongoose.connection.close();
    console.log('Connection closed.');
    process.exit(0);
  }
};

testConnection();
