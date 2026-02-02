const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

/* ================= RATE LIMITING ================= */
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= FRONTEND ================= */
app.use(express.static(path.join(__dirname, "public")));

// Default page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ================= EMAIL CONFIGURATION ================= */
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER || 'eventswedner@gmail.com',
        pass: process.env.EMAIL_PASS || process.env.EMAIL_APP_PASSWORD
    }
});

// Verify transporter configuration
transporter.verify((error, success) => {
    if (error) {
        console.log('❌ Email configuration error:', error);
    } else {
        console.log('✅ Email service is ready to send messages');
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
// Enhanced email template for admin
const getAdminEmailTemplate = (data) => {
    const { name, email, phone, event, date, message, guests, budget, venue } = data;
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Event Inquiry</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7fa; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                                🎊 New Event Inquiry!
                            </h1>
                            <p style="margin: 10px 0 0; color: #f0f0f0; font-size: 16px;">
                                ${event.toUpperCase()}
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Alert Badge -->
                    <tr>
                        <td style="padding: 0;">
                            <div style="background: linear-gradient(90deg, #ff6b6b 0%, #ee5a6f 100%); text-align: center; padding: 12px; color: white; font-weight: 600; font-size: 14px; letter-spacing: 0.5px;">
                                ⚡ URGENT: New Lead Received - Respond Within 2 Hours
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            
                            <!-- Customer Information -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                                <tr>
                                    <td colspan="2" style="padding-bottom: 20px; border-bottom: 3px solid #667eea;">
                                        <h2 style="margin: 0; color: #2d3748; font-size: 20px; font-weight: 600;">
                                            👤 Customer Information
                                        </h2>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 15px 0;">
                                        <table width="100%" cellpadding="8" cellspacing="0">
                                            <tr>
                                                <td style="width: 40%; color: #718096; font-size: 14px; font-weight: 600;">
                                                    📛 Full Name:
                                                </td>
                                                <td style="color: #2d3748; font-size: 15px; font-weight: 500;">
                                                    ${name}
                                                </td>
                                            </tr>
                                            <tr style="background-color: #f7fafc;">
                                                <td style="width: 40%; color: #718096; font-size: 14px; font-weight: 600; padding: 12px 8px;">
                                                    📧 Email:
                                                </td>
                                                <td style="color: #2d3748; font-size: 15px; padding: 12px 8px;">
                                                    <a href="mailto:${email}" style="color: #667eea; text-decoration: none; font-weight: 500;">
                                                        ${email}
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="width: 40%; color: #718096; font-size: 14px; font-weight: 600;">
                                                    📱 Phone:
                                                </td>
                                                <td style="color: #2d3748; font-size: 15px; font-weight: 500;">
                                                    <a href="tel:${phone}" style="color: #667eea; text-decoration: none;">
                                                        ${phone}
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Event Details -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                                <tr>
                                    <td colspan="2" style="padding-bottom: 20px; border-bottom: 3px solid #48bb78;">
                                        <h2 style="margin: 0; color: #2d3748; font-size: 20px; font-weight: 600;">
                                            🎉 Event Details
                                        </h2>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 15px 0;">
                                        <table width="100%" cellpadding="8" cellspacing="0">
                                            <tr>
                                                <td style="width: 40%; color: #718096; font-size: 14px; font-weight: 600;">
                                                    🎊 Event Type:
                                                </td>
                                                <td style="color: #2d3748; font-size: 15px; font-weight: 600;">
                                                    <span style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 6px 16px; border-radius: 20px; display: inline-block; font-size: 14px;">
                                                        ${event}
                                                    </span>
                                                </td>
                                            </tr>
                                            ${date ? `
                                            <tr style="background-color: #f7fafc;">
                                                <td style="width: 40%; color: #718096; font-size: 14px; font-weight: 600; padding: 12px 8px;">
                                                    📅 Event Date:
                                                </td>
                                                <td style="color: #2d3748; font-size: 15px; font-weight: 500; padding: 12px 8px;">
                                                    ${formatDate(date)}
                                                </td>
                                            </tr>
                                            ` : ''}
                                            ${guests ? `
                                            <tr>
                                                <td style="width: 40%; color: #718096; font-size: 14px; font-weight: 600;">
                                                    👥 Expected Guests:
                                                </td>
                                                <td style="color: #2d3748; font-size: 15px; font-weight: 500;">
                                                    ${guests} people
                                                </td>
                                            </tr>
                                            ` : ''}
                                            ${budget ? `
                                            <tr style="background-color: #f7fafc;">
                                                <td style="width: 40%; color: #718096; font-size: 14px; font-weight: 600; padding: 12px 8px;">
                                                    💰 Budget Range:
                                                </td>
                                                <td style="color: #2d3748; font-size: 15px; font-weight: 500; padding: 12px 8px;">
                                                    ₹${budget}
                                                </td>
                                            </tr>
                                            ` : ''}
                                            ${venue ? `
                                            <tr>
                                                <td style="width: 40%; color: #718096; font-size: 14px; font-weight: 600;">
                                                    📍 Preferred Venue:
                                                </td>
                                                <td style="color: #2d3748; font-size: 15px; font-weight: 500;">
                                                    ${venue}
                                                </td>
                                            </tr>
                                            ` : ''}
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Message -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                                <tr>
                                    <td style="padding-bottom: 15px; border-bottom: 3px solid #ed8936;">
                                        <h2 style="margin: 0; color: #2d3748; font-size: 20px; font-weight: 600;">
                                            💬 Customer Message
                                        </h2>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 20px; background-color: #fef5e7; border-left: 4px solid #ed8936; border-radius: 6px; margin-top: 15px;">
                                        <p style="margin: 0; color: #2d3748; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">
                                            ${message}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Quick Actions -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <table cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding: 0 10px;">
                                                    <a href="mailto:${email}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
                                                        📧 Reply to Customer
                                                    </a>
                                                </td>
                                                <td style="padding: 0 10px;">
                                                    <a href="tel:${phone}" style="display: inline-block; background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: white; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 12px rgba(72, 187, 120, 0.4);">
                                                        📱 Call Now
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #2d3748; padding: 25px 30px; text-align: center;">
                            <p style="margin: 0 0 10px; color: #cbd5e0; font-size: 13px;">
                                📅 Received on: ${new Date().toLocaleString('en-IN', { 
                                    timeZone: 'Asia/Kolkata', 
                                    dateStyle: 'full', 
                                    timeStyle: 'long' 
                                })}
                            </p>
                            <p style="margin: 10px 0 0; color: #a0aec0; font-size: 12px;">
                                This email was sent from <strong>Wedner Events Contact Form</strong>
                            </p>
                            <p style="margin: 8px 0 0; color: #718096; font-size: 11px;">
                                © 2025 Wedner Events & Production. All Rights Reserved.
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
};

// Enhanced email template for customer
const getCustomerEmailTemplate = (data) => {
    const { name, email, phone, event, date, message } = data;
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You - Wedner Events</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7fa; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                    
                    <!-- Header with gradient -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 30px; text-align: center; position: relative;">
                            <div style="font-size: 60px; margin-bottom: 10px;">🎊</div>
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                                Thank You, ${name}!
                            </h1>
                            <p style="margin: 15px 0 0; color: #f0f0f0; font-size: 18px; font-weight: 500;">
                                We've received your inquiry for<br>
                                <span style="background: rgba(255,255,255,0.2); padding: 8px 20px; border-radius: 20px; display: inline-block; margin-top: 10px; font-size: 16px; font-weight: 600;">
                                    ${event}
                                </span>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Success Message -->
                    <tr>
                        <td style="padding: 40px 30px; text-align: center;">
                            <div style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
                                <div style="font-size: 40px; margin-bottom: 10px;">✅</div>
                                <h2 style="margin: 0; font-size: 24px; font-weight: 700;">
                                    We're Excited to Work With You!
                                </h2>
                                <p style="margin: 10px 0 0; font-size: 15px; opacity: 0.95;">
                                    Your inquiry has been successfully received and our expert team is reviewing it
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Summary Box -->
                    <tr>
                        <td style="padding: 0 30px 30px;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #fef5e7 0%, #fef0e6 100%); border-radius: 10px; border: 2px solid #ed8936; overflow: hidden;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <h3 style="margin: 0 0 20px; color: #2d3748; font-size: 20px; font-weight: 700; text-align: center; border-bottom: 2px solid #ed8936; padding-bottom: 15px;">
                                            📋 Your Request Summary
                                        </h3>
                                        <table width="100%" cellpadding="10" cellspacing="0">
                                            <tr>
                                                <td style="width: 35%; color: #718096; font-size: 14px; font-weight: 600; vertical-align: top;">
                                                    🎉 Event Type:
                                                </td>
                                                <td style="color: #2d3748; font-size: 15px; font-weight: 600;">
                                                    ${event}
                                                </td>
                                            </tr>
                                            ${date ? `
                                            <tr style="background-color: rgba(255,255,255,0.5);">
                                                <td style="color: #718096; font-size: 14px; font-weight: 600; vertical-align: top;">
                                                    📅 Event Date:
                                                </td>
                                                <td style="color: #2d3748; font-size: 15px; font-weight: 500;">
                                                    ${formatDate(date)}
                                                </td>
                                            </tr>
                                            ` : ''}
                                            <tr>
                                                <td style="color: #718096; font-size: 14px; font-weight: 600; vertical-align: top;">
                                                    📱 Contact Number:
                                                </td>
                                                <td style="color: #2d3748; font-size: 15px; font-weight: 500;">
                                                    ${phone}
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- What's Next -->
                    <tr>
                        <td style="padding: 0 30px 30px;">
                            <div style="background: linear-gradient(135deg, #e6f7ff 0%, #f0f9ff 100%); border-radius: 10px; padding: 25px; border-left: 5px solid #4299e1;">
                                <h3 style="margin: 0 0 15px; color: #2d3748; font-size: 20px; font-weight: 700;">
                                    ⏱️ What Happens Next?
                                </h3>
                                <table width="100%" cellpadding="8" cellspacing="0">
                                    <tr>
                                        <td style="vertical-align: top; width: 40px;">
                                            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; text-align: center; line-height: 30px;">
                                                1
                                            </div>
                                        </td>
                                        <td style="color: #2d3748; font-size: 15px; line-height: 1.6;">
                                            Our event specialists review your requirements carefully
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="vertical-align: top;">
                                            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; text-align: center; line-height: 30px;">
                                                2
                                            </div>
                                        </td>
                                        <td style="color: #2d3748; font-size: 15px; line-height: 1.6;">
                                            We prepare a customized proposal for your event
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="vertical-align: top;">
                                            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; text-align: center; line-height: 30px;">
                                                3
                                            </div>
                                        </td>
                                        <td style="color: #2d3748; font-size: 15px; line-height: 1.6;">
                                            <strong style="color: #667eea;">We'll contact you within 24-48 hours</strong> to discuss details
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Contact Information -->
                    <tr>
                        <td style="padding: 0 30px 30px;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%); border-radius: 10px; overflow: hidden;">
                                <tr>
                                    <td style="padding: 30px; text-align: center;">
                                        <h3 style="margin: 0 0 20px; color: #ffffff; font-size: 20px; font-weight: 700;">
                                            📞 Need Immediate Assistance?
                                        </h3>
                                        <p style="margin: 0 0 25px; color: #cbd5e0; font-size: 15px;">
                                            Feel free to reach out to us directly!
                                        </p>
                                        
                                        <table width="100%" cellpadding="12" cellspacing="0" style="max-width: 500px; margin: 0 auto;">
                                            <tr>
                                                <td style="text-align: center;">
                                                    <div style="color: #48bb78; font-size: 24px; margin-bottom: 5px;">📱</div>
                                                    <div style="color: #a0aec0; font-size: 13px; margin-bottom: 5px;">Phone</div>
                                                    <a href="tel:+919156161444" style="color: #ffffff; text-decoration: none; font-weight: 600; font-size: 15px;">
                                                        +91 9156161444
                                                    </a>
                                                    <br>
                                                    <a href="tel:+919090638118" style="color: #ffffff; text-decoration: none; font-weight: 600; font-size: 15px;">
                                                        +91 9090638118
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="text-align: center;">
                                                    <div style="color: #4299e1; font-size: 24px; margin-bottom: 5px;">📧</div>
                                                    <div style="color: #a0aec0; font-size: 13px; margin-bottom: 5px;">Email</div>
                                                    <a href="mailto:wednerevents@gmail.com" style="color: #ffffff; text-decoration: none; font-weight: 600; font-size: 15px;">
                                                        wednerevents@gmail.com
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="text-align: center;">
                                                    <div style="color: #ed8936; font-size: 24px; margin-bottom: 5px;">📍</div>
                                                    <div style="color: #a0aec0; font-size: 13px; margin-bottom: 5px;">Location</div>
                                                    <div style="color: #ffffff; font-weight: 500; font-size: 14px; line-height: 1.6;">
                                                        Vighnaharta Vastu C-Wing,<br>
                                                        Ambegaon B.K, Pune 411046
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- WhatsApp CTA -->
                                        <table cellpadding="0" cellspacing="0" style="margin: 25px auto 0;">
                                            <tr>
                                                <td align="center">
                                                    <a href="https://wa.me/919156161444" style="display: inline-block; background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: white; text-decoration: none; padding: 16px 35px; border-radius: 30px; font-weight: 700; font-size: 16px; box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);">
                                                        💬 Chat on WhatsApp
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Social Media -->
                    <tr>
                        <td style="padding: 0 30px 30px; text-align: center;">
                            <p style="margin: 0 0 15px; color: #718096; font-size: 15px; font-weight: 600;">
                                Follow Us on Social Media
                            </p>
                            <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                                <tr>
                                    <td style="padding: 0 12px;">
                                        <a href="https://www.instagram.com/wednereventsandproduction/" style="display: inline-block; background: linear-gradient(135deg, #E1306C 0%, #C13584 100%); color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 12px rgba(225, 48, 108, 0.3);">
                                            📷 Instagram
                                        </a>
                                    </td>
                                    <td style="padding: 0 12px;">
                                        <a href="https://www.facebook.com/wednereventsandproduction" style="display: inline-block; background: linear-gradient(135deg, #1877F2 0%, #0D65D9 100%); color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 12px rgba(24, 119, 242, 0.3);">
                                            👍 Facebook
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Testimonial/Trust Badge -->
                    <tr>
                        <td style="padding: 0 30px 30px;">
                            <div style="background: linear-gradient(135deg, #fef5e7 0%, #fff5f5 100%); border-radius: 10px; padding: 25px; text-align: center; border: 2px dashed #ed8936;">
                                <div style="font-size: 40px; margin-bottom: 10px;">⭐⭐⭐⭐⭐</div>
                                <p style="margin: 0; color: #2d3748; font-size: 16px; font-style: italic; line-height: 1.6;">
                                    "Creating unforgettable moments through exceptional<br>event planning and production services"
                                </p>
                                <p style="margin: 15px 0 0; color: #718096; font-size: 14px; font-weight: 600;">
                                    — Wedner Events & Production
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%); padding: 30px; text-align: center;">
                            <p style="margin: 0 0 10px; color: #ffffff; font-size: 16px; font-weight: 600;">
                                Wedner Events & Production
                            </p>
                            <p style="margin: 0 0 15px; color: #cbd5e0; font-size: 13px; line-height: 1.6;">
                                Making your dreams come true, one event at a time
                            </p>
                            <p style="margin: 0; color: #718096; font-size: 12px;">
                                © 2025 Wedner Events. All Rights Reserved.
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
};

/* ================= BACKEND API ENDPOINTS ================= */
// Simple API endpoint (original)
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

        // Validate required fields
        if (!name || !email || !phone || !event || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields (name, email, phone, event, message)'
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Phone validation (Indian format)
        const phoneRegex = /^[6-9]\d{9}$/;
        const cleanPhone = phone.replace(/\D/g, '');
        if (!phoneRegex.test(cleanPhone)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid 10-digit phone number'
            });
        }

        const emailData = { name, email, phone, event, date, message, guests, budget, venue };

        // Admin email
        const adminMailOptions = {
            from: 'Wedner Events <eventswedner@gmail.com>',
            to: process.env.EMAIL_USER || 'eventswedner@gmail.com',
            subject: `🎊 New ${event} Inquiry from ${name}`,
            html: getAdminEmailTemplate(emailData)
        };

        // Customer email
        const customerMailOptions = {
            from: 'Wedner Events <eventswedner@gmail.com>',
            to: email,
            subject: `Thank You for Contacting Wedner Events & Production - ${event}`,
            html: getCustomerEmailTemplate(emailData)
        };

        // Send emails
        await Promise.all([
            transporter.sendMail(adminMailOptions),
            transporter.sendMail(customerMailOptions)
        ]);

        console.log(`✅ Emails sent successfully - Event: ${event}, Customer: ${name} (${email})`);

        res.json({
            success: true,
            message: 'Your message has been sent successfully! We will contact you within 24-48 hours.'
        });

    } catch (error) {
        console.error('❌ Error sending email:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again later or contact us directly.'
        });
    }
});

/* ================= HEALTH & TEST ENDPOINTS ================= */
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'running',
        service: 'Wedner Events Server',
        version: '3.0',
        features: [
            'Frontend serving',
            'Enhanced email system',
            'Rate limiting',
            'Input validation',
            'Auto-reply to customers'
        ],
        timestamp: new Date().toISOString()
    });
});

// Test endpoint
app.get('/test', (req, res) => {
    res.json({
        message: 'Server is working perfectly!',
        endpoints: {
            'POST /api/send-email': 'Simple email endpoint',
            'POST /send-email': 'Enhanced email endpoint with templates',
            'GET /': 'Frontend website',
            'GET /health': 'Health check',
            'GET /test': 'Test endpoint'
        }
    });
});

/* ================= ERROR HANDLING ================= */
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error occurred'
    });
});

/* ================= START SERVER ================= */
app.listen(PORT, () => {
    console.log("══════════════════════════════════════════════════════════");
    console.log("🎉           WEDNER EVENTS SERVER v3.0                  🎉");
    console.log("══════════════════════════════════════════════════════════");
    console.log(`🌐 Frontend:  http://localhost:${PORT}`);
    console.log(`📦 API Status: Running on port ${PORT}`);
    console.log(`📧 Email Service: Ready`);
    console.log(`🔒 Rate Limiting: 5 requests per 15 minutes per IP`);
    console.log("");
    console.log("📋 Available Endpoints:");
    console.log(`   POST http://localhost:${PORT}/api/send-email    - Simple email`);
    console.log(`   POST http://localhost:${PORT}/send-email        - Enhanced email`);
    console.log(`   GET  http://localhost:${PORT}/                  - Frontend`);
    console.log(`   GET  http://localhost:${PORT}/health            - Health check`);
    console.log(`   GET  http://localhost:${PORT}/test              - Test endpoint`);
    console.log("");
    console.log("📞 Contact Support:");
    console.log("   📧 Email: eventswedner@gmail.com");
    console.log("   📱 Phone: +91 9156161444");
    console.log("   📱 Phone: +91 9090638118");
    console.log("══════════════════════════════════════════════════════════\n");
});