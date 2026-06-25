# Pravesh Mitra - MHT-CET Counselling Platform

A full-stack responsive web application for MHT-CET college admission counselling platform for Maharashtra engineering aspirants.

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Start the server
npm start

# Open browser
http://localhost:3000
```

**That's it!** Your configuration is already complete. 🎉

📖 **New here?** Read [`QUICK_START.md`](QUICK_START.md) for a 2-minute guide.

---

## 🚀 Features

- ✅ Responsive design (works on all devices)
- ✅ Clean and modern UI similar to the reference design
- ✅ Form validation
- ✅ MongoDB Atlas integration
- ✅ RESTful API
- ✅ Success/Error notifications
- ✅ Multi-select for branches and cities
- ✅ **Automated Thank You emails with HTML template**
- ✅ **Professional email with counselling plans**
- ✅ **Nodemailer integration for Gmail SMTP**

## 🛠️ Tech Stack

**Frontend:**
- HTML5
- CSS3 (Responsive Design)
- JavaScript (Vanilla)

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- CORS enabled

## 📦 Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configuration is already done!**
   Your `.env` file is configured with:
   - ✅ MongoDB Atlas
   - ✅ Gmail SMTP
   - ✅ Port settings

3. **Start the server:**
```bash
npm start
```

   For development with auto-restart:
   ```bash
   npm run dev
   ```

4. **Open your browser:**
```
http://localhost:3000
```

📖 See `SETUP.md` for detailed setup instructions and troubleshooting.

## 🔗 API Endpoints

### POST `/api/submit`
Submit student counselling form

**Request Body:**
```json
{
  "fullName": "John Doe",
  "mobileNo": "9876543210",
  "email": "john@example.com",
  "mhtCetScore": 150.5,
  "jeeScore": 250.0,
  "branches": ["Computer Engineering", "IT"],
  "cities": ["Mumbai", "Pune"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Response submitted successfully!",
  "data": { ... }
}
```

### GET `/api/responses`
Get all submitted responses (for admin/testing)

## 📱 Responsive Breakpoints

- **Desktop:** > 768px
- **Tablet:** 481px - 768px
- **Mobile:** ≤ 480px

## 🗂️ Project Structure

```
PraveshMitraSuggestions/
├── public/
│   ├── index.html          # Main HTML file
│   ├── styles.css          # Responsive CSS
│   └── script.js           # Frontend JavaScript
├── server.js               # Express server + MongoDB
├── package.json            # Dependencies
├── .env.example            # Environment variables template
├── .gitignore             # Git ignore file
└── README.md              # This file
```

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB Atlas Connection
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=<appname>

# Gmail SMTP Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password

# Server Configuration
PORT=3000
NODE_ENV=development
```

**🔐 Security:** Never commit your `.env` file to Git! It's already in `.gitignore`.

## 📊 MongoDB Schema

```javascript
{
  fullName: String,
  mobileNo: String,
  email: String,
  mhtCetScore: Number,
  jeeScore: Number (optional),
  branches: [String],
  cities: [String],
  submittedAt: Date
}
```

## 🎨 Design Features

- Modern gradient background
- Card-based form layout
- Smooth animations
- Input focus effects
- Loading states
- Success/Error messages
- Privacy assurance badge
- Fully responsive on all devices

## 🧪 Testing

1. Fill out the form with valid data
2. Submit and check the success message
3. View submitted data at: `http://localhost:3000/api/responses`

## 📝 Next Steps

- Add authentication for admin panel
- Create college suggestion algorithm
- Add data visualization dashboard
- Implement email notifications
- Add PDF report generation

## 🤝 Contributing

Feel free to fork and submit pull requests!

## 📄 License

MIT License
