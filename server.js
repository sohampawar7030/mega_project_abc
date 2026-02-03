const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

/* ================= RATE LIMITING ================= */
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many requests, please try again later.'
});

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= FRONTEND ================= */
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ================= EMAIL CONFIG ================= */
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

transporter.verify((error) => {
    if (error) {
        console.log("❌ Email error:", error);
    } else {
        console.log("✅ Email service ready");
    }
});

/* ================= HELPERS ================= */
const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });
};

/* ================= SIMPLE API ================= */
app.post("/api/send-email", async (req, res) => {
    const { name, email, phone, event, message } = req.body;

    if (!name || !email || !phone || !event || !message) {
        return res.status(400).json({ success: false });
    }

    try {
        await transporter.sendMail({
            from: `"Wedner Events" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
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

/* ================= MAIN EMAIL ENDPOINT ================= */
app.post("/send-email", limiter, async (req, res) => {
    try {
        const { name, email, phone, event, date, message } = req.body;

        if (!name || !email || !phone || !event || !message) {
            return res.status(400).json({
                success: false,
                message: "All required fields missing"
            });
        }

        const adminMail = {
            from: `"Wedner Events" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: `🎉 New ${event} Inquiry`,
            html: `
                <h2>New Inquiry</h2>
                <p><b>Name:</b> ${name}</p>
                <p><b>Email:</b> ${email}</p>
                <p><b>Phone:</b> ${phone}</p>
                <p><b>Event:</b> ${event}</p>
                <p><b>Date:</b> ${formatDate(date)}</p>
                <p><b>Message:</b> ${message}</p>
            `
        };

        const customerMail = {
            from: `"Wedner Events" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Thank you for contacting Wedner Events",
            html: `
                <h2>Hello ${name},</h2>
                <p>Thank you for contacting <b>Wedner Events & Production</b>.</p>
                <p>We received your inquiry for <b>${event}</b>.</p>
                <p>Our team will contact you within 24–48 hours.</p>
                <br/>
                <p>Regards,<br/>Wedner Events Team</p>
            `
        };

        await Promise.all([
            transporter.sendMail(adminMail),
            transporter.sendMail(customerMail)
        ]);

        res.json({
            success: true,
            message: "Email sent successfully"
        });

    } catch (error) {
        console.error("Email error:", error);
        res.status(500).json({
            success: false,
            message: "Email sending failed"
        });
    }
});

/* ================= HANDLE WRONG METHOD ================= */
app.get("/send-email", (req, res) => {
    res.status(405).json({
        success: false,
        message: "This endpoint only supports POST request"
    });
});

/* ================= HEALTH ================= */
app.get("/health", (req, res) => {
    res.json({
        status: "running",
        platform: "vercel",
        timestamp: new Date()
    });
});

/* ================= EXPORT FOR VERCEL ================= */
module.exports = app;
