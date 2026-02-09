const express = require("express");
const path = require("path");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const client = require("prom-client"); // Prometheus client

const app = express();

/* ================= RATE LIMITING ================= */
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "Too many requests, please try again later."
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

    console.log("📩 New Inquiry (simple):", {
        name,
        email,
        phone,
        event,
        message
    });

    res.json({ success: true });
});

/* ================= MAIN ENDPOINT ================= */
app.post("/send-email", limiter, async (req, res) => {
    const { name, email, phone, event, date, message } = req.body;

    if (!name || !email || !phone || !event || !message) {
        return res.status(400).json({
            success: false,
            message: "All required fields missing"
        });
    }

    console.log("🎉 New Event Inquiry:", {
        name,
        email,
        phone,
        event,
        date: formatDate(date),
        message
    });

    res.json({
        success: true,
        message: "Request received successfully"
    });
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
        timestamp: new Date()
    });
});

/* ================= PROMETHEUS METRICS ================= */
client.collectDefaultMetrics();

const metricsApp = express();
metricsApp.get("/metrics", async (req, res) => {
    res.set("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
});

/* ================= START SERVERS ================= */
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    const METRICS_PORT = process.env.METRICS_PORT || 9100;

    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });

    metricsApp.listen(METRICS_PORT, () => {
        console.log(`📊 Prometheus metrics available at http://localhost:${METRICS_PORT}/metrics`);
    });
}

/* ================= EXPORT (Vercel Safe) ================= */
module.exports = app;
