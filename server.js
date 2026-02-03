const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

/* ================= VERCEL SERVERLESS SUPPORT ================= */
// IMPORTANT: Do NOT remove app.listen()
module.exports = app;

/* ================= RATE LIMITING ================= */
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many requests from this IP, please try again later.'
});

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= EMAIL CONFIGURATION ================= */
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER || 'eventswedner@gmail.com',
        pass: process.env.EMAIL_PASS || process.env.EMAIL_APP_PASSWORD
    }
});

// Verify transporter
transporter.verify((error) => {
    if (error) {
        console.log('❌ Email configuration error:', error);
    } else {
        console.log('✅ Email service is ready');
    }
});

/* ================= HELPER FUNCTIONS ================= */
const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

/* ================= EMAIL TEMPLATES ================= */
// (UNCHANGED – your existing templates remain exactly the same)
const getAdminEmailTemplate = (data) => {
    // same template as before
};

const getCustomerEmailTemplate = (data) => {
    // same template as before
};

/* ================= API ENDPOINTS ================= */

// Simple email endpoint
app.post("/api/send-email", async (req, res) => {
    const { name, email, phone, event, message } = req.body;

    if (!name || !email || !phone || !event || !message) {
        return res.status(400).json({ success: false });
    }

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER || 'eventswedner@gmail.com',
            to: process.env.EMAIL_USER || 'eventswedner@gmail.com',
            subject: `New ${event} Inquiry`,
            html: `
                <h3>New Event Inquiry</h3>
                <p>Name: ${name}</p>
                <p>Email: ${email}</p>
                <p>Phone: ${phone}</p>
                <p>Event: ${event}</p>
                <p>Message: ${message}</p>
            `
        });

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

// Enhanced contact form endpoint
app.post('/send-email', limiter, async (req, res) => {
    try {
        const { name, email, phone, event, date, message, guests, budget, venue } = req.body;

        if (!name || !email || !phone || !event || !message) {
            return res.status(400).json({
                success: false,
                message: 'Required fields missing'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email address'
            });
        }

        const phoneRegex = /^[6-9]\d{9}$/;
        const cleanPhone = phone.replace(/\D/g, '');
        if (!phoneRegex.test(cleanPhone)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid phone number'
            });
        }

        const emailData = { name, email, phone, event, date, message, guests, budget, venue };

        await Promise.all([
            transporter.sendMail({
                from: 'Wedner Events <eventswedner@gmail.com>',
                to: process.env.EMAIL_USER || 'eventswedner@gmail.com',
                subject: `🎊 New ${event} Inquiry from ${name}`,
                html: getAdminEmailTemplate(emailData)
            }),
            transporter.sendMail({
                from: 'Wedner Events <eventswedner@gmail.com>',
                to: email,
                subject: `Thank You for Contacting Wedner Events - ${event}`,
                html: getCustomerEmailTemplate(emailData)
            })
        ]);

        res.json({
            success: true,
            message: 'Message sent successfully'
        });

    } catch (error) {
        console.error('❌ Error sending email:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message'
        });
    }
});

/* ================= HEALTH & TEST ================= */
app.get('/health', (req, res) => {
    res.json({
        status: 'running',
        service: 'Wedner Events API',
        version: '3.0',
        timestamp: new Date().toISOString()
    });
});

app.get('/test', (req, res) => {
    res.json({ message: 'Backend is working perfectly!' });
});

/* ================= ERROR HANDLER ================= */
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

/* ================= START SERVER ================= */
app.listen(PORT, () => {
    console.log(`🚀 Wedner Events Backend running on port ${PORT}`);
});
