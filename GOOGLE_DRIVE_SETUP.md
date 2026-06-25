# Google Drive Document Setup Guide

## Overview
This system allows users to select their percentile range and receive a direct link to the corresponding college list document without exposing your Google Drive folder structure.

---

## Step 1: Organize Your Google Drive

### Your Main Folder
You mentioned: `https://drive.google.com/drive/folders/1BLnJM-swXf7xtQpFryLVa4ZLwSAHPE3m`

### Create Documents for Each Percentile Range

Create 10 documents (PDF, Google Docs, or Excel) in your main folder:

1. 10-30 Percentile College List
2. 20-40 Percentile College List
3. 30-50 Percentile College List
4. 40-60 Percentile College List
5. 50-70 Percentile College List
6. 60-80 Percentile College List
7. 70-90 Percentile College List
8. 80-100 Percentile College List
9. 90-99 Percentile College List
10. 99-100 Percentile College List (Top Tier)

---

## Step 2: Make Documents Shareable

For EACH document:

1. **Right-click the document** → **Share** → **Get link**
2. **Change access** to: "Anyone with the link can view"
3. **Copy the link** - it will look like:
   ```
   https://drive.google.com/file/d/1Abc123XyZ456.../view
   ```
4. **Extract the FILE ID** (the part between `/d/` and `/view`)
   - Example: `1Abc123XyZ456...` is the FILE ID

---

## Step 3: Configure Your Application

### Open the file: `driveConfig.js`

Replace each `YOUR_FILE_ID_HERE` with the actual file ID:

```javascript
const driveDocuments = {
  '10-30': {
    fileId: '1Abc123XyZ456...',  // ← Paste your file ID here
    name: '10-30 Percentile College List'
  },
  '20-40': {
    fileId: '1Def789UvW012...',  // ← Paste your file ID here
    name: '20-40 Percentile College List'
  },
  // ... and so on for all 10 ranges
};
```

### Example - How to Extract File ID:

**Full Google Drive Link:**
```
https://drive.google.com/file/d/1BLnJM-swXf7xtQpFryLVa4ZLwSAHPE3m/view?usp=sharing
```

**File ID (extract this part):**
```
1BLnJM-swXf7xtQpFryLVa4ZLwSAHPE3m
```

---

## Step 4: How It Works

### User Experience:
1. User fills form
2. Selects percentile range from dropdown
3. Submits form
4. Receives email with direct link to document
5. Clicks link → Opens document directly
6. **NO Drive folder structure visible!**

### Link Format:
- ❌ NOT: `https://drive.google.com/drive/folders/...` (shows your folder)
- ✅ YES: `https://drive.google.com/file/d/FILE_ID/view` (direct document link)

---

## Step 5: Test Your Setup

### Local Testing:

1. Make sure `driveConfig.js` has all file IDs filled
2. Run: `npm run dev`
3. Fill the form with test data
4. Select a percentile range
5. Submit
6. Check:
   - ✅ Success message appears
   - ✅ Button "View Your College List" shows
   - ✅ Email received with document link
   - ✅ Link opens the correct document

### Production (Vercel):

1. **DO NOT commit `driveConfig.js` to Git** (it's in `.gitignore`)
2. Copy the content of your configured `driveConfig.js`
3. Deploy to Vercel
4. Manually upload `driveConfig.js` if needed, OR
5. Use environment variables (advanced - see below)

---

## Step 6: Security Best Practices

### ✅ What We Did:

1. **`driveConfig.js` is in `.gitignore`**
   - Won't be pushed to GitHub
   - Keeps your file IDs private

2. **Direct file links, not folder links**
   - Users can't browse your Drive
   - Can only access the specific document

3. **`driveConfig.example.js` provided**
   - Safe template for GitHub
   - Shows structure without exposing IDs

### ⚠️ Important:

- **Never commit `driveConfig.js` with real file IDs to GitHub!**
- Keep your Google Drive documents set to "Anyone with link can view"
- Consider using environment variables for extra security (see Advanced section)

---

## Advanced: Using Environment Variables (Optional)

Instead of `driveConfig.js`, you can use environment variables:

### In `.env` file:
```env
DRIVE_10_30=1Abc123XyZ456...
DRIVE_20_40=1Def789UvW012...
DRIVE_30_50=1Ghi345Rst678...
# ... etc
```

### In `driveConfig.js`:
```javascript
const driveDocuments = {
  '10-30': {
    fileId: process.env.DRIVE_10_30 || 'YOUR_FILE_ID_HERE',
    name: '10-30 Percentile College List'
  },
  // ... etc
};
```

### In Vercel Dashboard:
Add each environment variable in Settings → Environment Variables

---

## Troubleshooting

### "No document found for percentile range"
- Check that file ID is correctly added in `driveConfig.js`
- Verify file ID doesn't have extra spaces

### "Access denied" when opening link
- Make sure document is set to "Anyone with link can view"
- Verify you copied the correct file ID

### Document link not showing in email
- Check that `driveConfig.js` is present in server directory
- Verify file ID is not `YOUR_FILE_ID_HERE`
- Check server logs for errors

---

## File Structure

```
PraveshMitraSuggestions/
├── driveConfig.js           ← YOUR ACTUAL FILE IDS (not in git)
├── driveConfig.example.js   ← TEMPLATE (safe to commit)
├── .gitignore              ← Ensures driveConfig.js not committed
├── server.js               ← Uses getDocumentLink()
├── emailService.js         ← Includes document link in email
└── GOOGLE_DRIVE_SETUP.md   ← This guide
```

---

## Quick Reference

### To Add a New Document:

1. Upload to your Drive folder
2. Right-click → Share → Get link → Anyone with link
3. Copy file ID from the link
4. Add to `driveConfig.js`:
```javascript
'NEW-RANGE': {
  fileId: 'YOUR_NEW_FILE_ID',
  name: 'Display Name'
}
```
5. Add to dropdown in `public/index.html`
6. Restart server

---

## Support

If you need help:
1. Check that all file IDs are correct
2. Verify Google Drive sharing settings
3. Test with one document first
4. Check server logs for errors

**Remember: NEVER commit `driveConfig.js` with real file IDs to GitHub!**
