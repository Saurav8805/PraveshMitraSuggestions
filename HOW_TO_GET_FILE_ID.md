# How to Get Google Drive File ID - Visual Guide

## Step-by-Step Process:

### 1️⃣ Upload or Select Your Document

Go to your folder:
```
https://drive.google.com/drive/folders/1BLnJM-swXf7xtQpFryLVa4ZLwSAHPE3m
```

Upload a document or select an existing one.

---

### 2️⃣ Right-Click and Get Link

Right-click on the file → Click **"Share"** or **"Get link"**

**IMPORTANT:** Set to "Anyone with the link can view"

---

### 3️⃣ Copy the Link

Click **"Copy link"** - you'll get something like:

```
https://drive.google.com/file/d/1BLnJM-swXf7xtQpFryLVa4ZLwSAHPE3m/view?usp=sharing
```

---

### 4️⃣ Extract the File ID

**Break down the URL:**

```
https://drive.google.com/file/d/   1BLnJM-swXf7xtQpFryLVa4ZLwSAHPE3m   /view?usp=sharing
                            ↑↑↑↑↑  ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑  ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
                         Start    THIS IS YOUR FILE ID              End
```

**File ID:** `1BLnJM-swXf7xtQpFryLVa4ZLwSAHPE3m`

---

### 5️⃣ Paste into driveConfig.js

Open `driveConfig.js` and replace `YOUR_FILE_ID_HERE`:

```javascript
'10-30': {
  fileId: '1BLnJM-swXf7xtQpFryLVa4ZLwSAHPE3m',  // ← Paste your file ID here
  name: '10-30 Percentile College List'
},
```

---

## Quick Reference Examples:

### Example 1: Google Docs
**Full URL:**
```
https://docs.google.com/document/d/1Abc123XyZ456/edit?usp=sharing
```
**File ID:** `1Abc123XyZ456`

### Example 2: Google Sheets
**Full URL:**
```
https://docs.google.com/spreadsheets/d/1Def789UvW012/edit?usp=sharing
```
**File ID:** `1Def789UvW012`

### Example 3: PDF File
**Full URL:**
```
https://drive.google.com/file/d/1Ghi345Rst678/view?usp=sharing
```
**File ID:** `1Ghi345Rst678`

---

## Common Mistakes to Avoid:

❌ **WRONG - Copying the whole URL:**
```javascript
fileId: 'https://drive.google.com/file/d/1BLnJM-swXf7xtQpFryLVa4ZLwSAHPE3m/view?usp=sharing'
```

❌ **WRONG - Including /d/ or /view:**
```javascript
fileId: '/d/1BLnJM-swXf7xtQpFryLVa4ZLwSAHPE3m/view'
```

✅ **CORRECT - Only the ID:**
```javascript
fileId: '1BLnJM-swXf7xtQpFryLVa4ZLwSAHPE3m'
```

---

## Easy Copy-Paste Template:

For each document, follow this pattern:

1. Get link from Google Drive
2. Copy everything between `/d/` and `/view` (or `/edit`)
3. Paste into driveConfig.js

---

## Example Workflow:

### Document: 10-30 Percentile College List

**Step 1:** Upload document to Google Drive
**Step 2:** Right-click → Share → "Anyone with link" → Copy link
**Step 3:** Link: `https://drive.google.com/file/d/1Abc123/view`
**Step 4:** File ID: `1Abc123`
**Step 5:** Update driveConfig.js:

```javascript
'10-30': {
  fileId: '1Abc123',
  name: '10-30 Percentile College List'
},
```

**Repeat for all 10 percentile ranges!**

---

## File ID Characteristics:

- Usually 28-44 characters long
- Contains letters (a-z, A-Z), numbers (0-9), hyphens (-), and underscores (_)
- Example lengths:
  - Short: `1BLnJM-swXf7xtQpFryLVa4ZLwSAH`
  - Medium: `1BLnJM-swXf7xtQpFryLVa4ZLwSAHPE3m`
  - Long: `1BLnJM-swXf7xtQpFryLVa4ZLwSAHPE3m-xyz123`

---

## Testing Your File ID:

After adding the file ID, test the direct link:

```
https://drive.google.com/file/d/YOUR_FILE_ID_HERE/view
```

If it opens your document, the file ID is correct! ✅

---

## Need Help?

If you're stuck:
1. Make sure the document is shared ("Anyone with the link can view")
2. Double-check you copied only the ID part (nothing before or after)
3. No spaces or extra characters
4. The ID is case-sensitive - copy it exactly!

---

**That's it!** Just repeat this for all 10 documents and you're done! 🚀
