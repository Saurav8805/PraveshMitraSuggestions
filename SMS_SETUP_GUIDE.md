# SMS OTP Setup Guide (Free)

## Overview
Your form now requires both Email and Mobile verification via OTP before submission. Email OTP works automatically with your existing Gmail configuration. For SMS OTP, you can use Fast2SMS (free tier).

---

## Option 1: Fast2SMS (Recommended - Free Tier Available)

### Step 1: Sign Up
1. Go to: https://www.fast2sms.com/
2. Click **"Sign Up"**
3. Register with your mobile number
4. Verify your mobile

### Step 2: Get API Key
1. After login, go to: **Dev API** → **API Keys**
2. Click **"Create New API Key"**
3. **Copy the API key** (looks like: `abcd1234xyz5678...`)

### Step 3: Add to .env File
```env
FAST2SMS_API_KEY=your-api-key-here
```

### Free Tier Limits:
- ✅ 50 SMS per day (free)
- ✅ OTP messages included
- ✅ No credit card required
- ✅ Valid in India only

---

## Option 2: Without SMS (Email Only)

If you don't want to use SMS:

### In `.env` file:
```env
# Leave FAST2SMS_API_KEY empty or don't add it
# FAST2SMS_API_KEY=
```

### What happens:
- Email OTP works normally
- Mobile OTP shows in server console (development mode)
- For testing: Check server logs for the OTP
- For production: Users must verify email only

---

## Option 3: Other SMS Services

### MSG91 (Free Trial)
1. Sign up: https://msg91.com/
2. Get API key from dashboard
3. Update `otpService.js` to use MSG91 API
4. Free trial: 100 SMS

### Twilio (Paid, but reliable)
1. Sign up: https://www.twilio.com/
2. Get credentials
3. Update `otpService.js`
4. $15 free credit for new users

---

## Testing Without SMS Service

### Development Mode:
If `FAST2SMS_API_KEY` is not set, the system shows OTP in:
1. **Server console logs**
2. **API response** (in development only)

### Test Workflow:
1. User fills form
2. Enters mobile number
3. Clicks "Send OTP"
4. **Check terminal** for: `Mock SMS OTP for 9876543210: 123456`
5. Enter the OTP from terminal
6. Verify and submit

---

## How OTP System Works:

### User Flow:
```
1. User enters Name, Mobile, Email
2. "Send OTP" buttons appear
3. Click "Send OTP" for Mobile → Receives SMS
4. Click "Send OTP" for Email → Receives Email
5. Enter both OTPs
6. Click "Verify" for each
7. Both show ✓ Verified
8. "GET MY SUGGESTIONS" button becomes active
9. User fills rest of form
10. Submits successfully
```

### Security Features:
- ✅ OTP expires in 5 minutes
- ✅ Maximum 3 verification attempts
- ✅ Can resend OTP
- ✅ OTPs stored temporarily (in-memory)
- ✅ Different OTPs for email and mobile

---

## Environment Variables Summary:

```env
# MongoDB Atlas Connection
MONGO_URI=mongodb+srv://username:password@cluster...

# Gmail SMTP (Required for Email OTP)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password

# SMS Service (Optional - leave empty to skip SMS)
FAST2SMS_API_KEY=your-fast2sms-api-key

# Server Configuration
PORT=3000
NODE_ENV=development
```

---

## Deployment to Vercel:

### Add Environment Variables:
1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   - `MONGO_URI` = your MongoDB connection
   - `GMAIL_USER` = your Gmail
   - `GMAIL_APP_PASSWORD` = your Gmail app password
   - `FAST2SMS_API_KEY` = your Fast2SMS key (or leave empty)
   - `NODE_ENV` = production

### Important:
- If `FAST2SMS_API_KEY` is empty, SMS OTP won't work in production
- Consider using email-only verification for production if SMS setup is difficult

---

## Troubleshooting:

### SMS OTP not received:
- Check Fast2SMS dashboard → SMS logs
- Verify API key is correct
- Ensure mobile number is Indian (10 digits)
- Check Fast2SMS daily limit not exceeded

### Email OTP not received:
- Check Gmail spam folder
- Verify `GMAIL_APP_PASSWORD` is correct
- Ensure 2FA is enabled on Gmail account

### OTP expired:
- Click "Resend OTP"
- OTPs expire after 5 minutes

### "Too many attempts":
- Request new OTP
- Maximum 3 wrong attempts allowed

---

## Alternative: Disable OTP Verification

If you want to disable OTP verification temporarily:

### In `public/otpVerification.js`:
Comment out the verification check:
```javascript
window.addEventListener('load', function() {
    const submitBtn = document.querySelector('.submit-btn');
    // submitBtn.disabled = true;  // Comment this out
    submitBtn.style.opacity = '1';
});
```

**Not recommended for production!**

---

## Cost Comparison:

| Service | Free Tier | Cost After Free |
|---------|-----------|-----------------|
| Fast2SMS | 50 SMS/day | ₹0.15/SMS |
| MSG91 | 100 SMS trial | ₹0.20/SMS |
| Twilio | $15 credit | $0.0079/SMS |
| Email (Gmail) | Unlimited | Free |

**Recommendation:** Use Fast2SMS free tier (50 SMS/day is enough for testing)

---

## Production Recommendations:

1. **Start with Email-only**: Test with email verification first
2. **Add SMS later**: Once users increase, add Fast2SMS
3. **Monitor usage**: Check Fast2SMS dashboard for daily limits
4. **Upgrade if needed**: Buy credits when free tier exhausted

---

**Need Help?**
- Fast2SMS Support: https://www.fast2sms.com/support
- Fast2SMS API Docs: https://docs.fast2sms.com/

**Ready to test!** Add your Fast2SMS API key to `.env` and restart the server.
