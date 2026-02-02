# Wedner Events Contact Form Email Integration

This project integrates Gmail email functionality into the Wedner Events contact form. When users submit the contact form, it automatically sends:
1. A detailed notification email to you (sohampawar92518@gmail.com)
2. An auto-reply confirmation email to the customer

## 📋 Features

- ✅ Beautiful HTML formatted emails
- ✅ Automatic admin notification with all submission details
- ✅ Customer auto-reply with company information
- ✅ Form validation (email, phone, required fields)
- ✅ Loading states and error handling
- ✅ Responsive design
- ✅ Success/error messages

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher) installed on your computer
- Gmail account with App Password configured
- Basic knowledge of terminal/command line

### Step 1: Install Node.js
If you don't have Node.js installed:
1. Visit https://nodejs.org/
2. Download and install the LTS version
3. Verify installation: `node --version`

### Step 2: Setup Project Files

1. **Create a project folder** (e.g., `wedner-email-server`)

2. **Copy these files into the folder:**
   - `server.js` (Node.js backend server)
   - `package.json` (Dependencies configuration)
   - `contact.html` (Updated contact page)

3. **Open terminal/command prompt** in the project folder

### Step 3: Install Dependencies

Run this command in terminal:
```bash
npm install
```

This will install:
- express (web server)
- nodemailer (email sending)
- cors (cross-origin requests)
- body-parser (form data handling)

### Step 4: Start the Server

Run:
```bash
npm start
```

You should see:
```
Server is running on http://localhost:3000
Email service is ready!
Server is ready to send emails
```

### Step 5: Update Your Website

1. Replace your old `contact.html` with the new one
2. Make sure the `SERVER_URL` in contact.html matches your server:
   - For local testing: `http://localhost:3000`
   - For production: Your actual server URL

## 🧪 Testing

1. **Start the server** (npm start)
2. **Open contact.html** in your browser
3. **Fill out the form** and submit
4. **Check your email** (sohampawar92518@gmail.com)

You should receive:
- Admin notification with submission details
- Customer should receive auto-reply confirmation

## 📧 Email Templates

### Admin Notification Email
- Beautifully formatted with gradient header
- All submission details clearly displayed
- Event type badge
- Formatted date and time
- Customer contact information

### Customer Auto-Reply Email
- Personalized greeting with customer name
- Request summary
- Company contact information
- Social media links
- WhatsApp quick link
- Professional footer

## ⚙️ Configuration

### Change Email Settings
Edit `server.js`:

```javascript
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',    // Change this
    pass: 'your-app-password'         // Change this
  }
});
```

### Change Recipient Email
In `server.js`, update the `to` field:

```javascript
to: 'your-email@gmail.com',  // Change this
```

### Change Server Port
In `server.js`:

```javascript
const PORT = 3000;  // Change to any available port
```

## 🌐 Deployment Options

### Option 1: Local Server (Testing Only)
- Keep server running on your computer
- Access via http://localhost:3000
- Only works when your computer is on

### Option 2: Cloud Hosting (Recommended for Production)

#### A. Heroku (Free Tier Available)
1. Create Heroku account: https://heroku.com
2. Install Heroku CLI
3. Deploy:
   ```bash
   heroku login
   heroku create wedner-events-email
   git init
   git add .
   git commit -m "Initial commit"
   git push heroku master
   ```
4. Update `SERVER_URL` in contact.html to your Heroku URL

#### B. Railway.app (Easy & Free)
1. Visit https://railway.app
2. Connect GitHub repository
3. Deploy automatically
4. Get your production URL
5. Update `SERVER_URL` in contact.html

#### C. Render.com (Free Tier)
1. Visit https://render.com
2. Create new Web Service
3. Connect repository
4. Auto-deploys on push

#### D. Your Own Server (VPS)
If you have a VPS (DigitalOcean, AWS, etc.):
1. Copy files to server
2. Install Node.js on server
3. Run with PM2 for auto-restart:
   ```bash
   npm install -g pm2
   pm2 start server.js
   pm2 startup
   pm2 save
   ```

### Update After Deployment
In `contact.html`, change:
```javascript
const SERVER_URL = 'http://localhost:3000';
```
To:
```javascript
const SERVER_URL = 'https://your-deployed-url.com';
```

## 🔒 Security Best Practices

### 1. Environment Variables (Production)
Don't hardcode passwords! Use environment variables:

**Create `.env` file:**
```
EMAIL_USER=sohampawar92518@gmail.com
EMAIL_PASS=fgwe pcbx mjbn dosf
PORT=3000
```

**Install dotenv:**
```bash
npm install dotenv
```

**Update server.js:**
```javascript
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

### 2. Add Rate Limiting
Prevent spam:
```bash
npm install express-rate-limit
```

**In server.js:**
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // 5 requests per 15 minutes
});

app.post('/send-email', limiter, async (req, res) => {
  // ... existing code
});
```

### 3. CORS Configuration
For production, specify allowed origins:
```javascript
app.use(cors({
  origin: 'https://your-website.com'
}));
```

## 🐛 Troubleshooting

### Problem: "Cannot find module 'express'"
**Solution:** Run `npm install`

### Problem: "Error: Invalid login"
**Solution:** 
- Verify app password is correct
- Make sure 2FA is enabled on Gmail
- Remove spaces from app password

### Problem: "CORS error"
**Solution:** 
- Make sure CORS is enabled in server.js
- Check SERVER_URL matches your actual server

### Problem: Emails not sending
**Solution:**
- Check console for errors
- Verify Gmail app password
- Check spam folder
- Ensure internet connection

### Problem: "Port 3000 already in use"
**Solution:** 
- Change PORT in server.js
- Or kill process: `lsof -ti:3000 | xargs kill`

## 📱 Testing Checklist

- [ ] Server starts without errors
- [ ] Form submits successfully
- [ ] Admin receives notification email
- [ ] Customer receives auto-reply
- [ ] All form fields validate correctly
- [ ] Success message appears
- [ ] Form resets after submission
- [ ] Loading state shows during submission
- [ ] Error messages work for invalid inputs

## 📞 Support

If you encounter issues:
1. Check server console for error messages
2. Check browser console (F12) for JavaScript errors
3. Verify all files are in correct locations
4. Ensure dependencies are installed
5. Check Gmail app password is correct

## 🎨 Customization

### Email Design
Edit HTML templates in `server.js`:
- Change colors
- Modify layout
- Add company logo
- Update text content

### Form Fields
In `contact.html`:
- Add new fields
- Modify validation
- Change event types dropdown

### Success/Error Messages
Customize messages in `contact.html`:
```javascript
function showSuccess() {
  // Customize success message
}

function showError(message) {
  // Customize error display
}
```

## 📄 File Structure

```
wedner-email-server/
├── server.js           # Backend email server
├── package.json        # Dependencies
├── contact.html        # Updated contact form
├── .env               # Environment variables (create this)
└── README.md          # This file
```

## 🔄 Maintenance

### Update Dependencies
```bash
npm update
```

### Check for Security Issues
```bash
npm audit
npm audit fix
```

### Monitor Server
Use PM2 for production monitoring:
```bash
pm2 logs
pm2 status
```

## 📈 Future Enhancements

Possible improvements:
- [ ] Database integration to store submissions
- [ ] Email templates with company logo
- [ ] File attachment support
- [ ] SMS notifications
- [ ] Admin dashboard to view submissions
- [ ] Calendar integration for event dates
- [ ] Automated follow-up emails

## ✅ Production Checklist

Before going live:
- [ ] Use environment variables for sensitive data
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Configure CORS properly
- [ ] Test on multiple devices
- [ ] Set up automatic backups
- [ ] Monitor email delivery rates

---

**Created by:** Soham Pawar
**For:** Wedner Events & Production
**Date:** February 2025

For questions or support, contact: sohampawar92518@gmail.com
```
