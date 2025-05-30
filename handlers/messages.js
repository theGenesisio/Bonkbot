import checkAdmin from '../db/methods/ReadMethods/checkAdmin.js';

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

const registerMessageHandlers = (bot) => {
    bot.on('message', async (msg) => {
        const text = msg.text?.trim();
        const telegramId = msg.from?.id;

        if (!text) return;

        const isBotCommand = msg.entities?.some(entity => entity.type === 'bot_command');
        if (isBotCommand) return;

        if (!text.startsWith('admin')) {
            bot.sendMessage(msg.chat.id, "❓ That was not a valid command. Use /help to see what’s available.");
            return;
        }

        const [command, ...args] = text.split(' ');
        const value = args.join(' ');

        if (!validAdminCommands.has(command)) {
            bot.sendMessage(msg.chat.id, "❌ Invalid admin command. Use a valid one from the list.");
            return;
        }
        if (msg.from.is_bot) {
            bot.sendMessage(msg.chat.id, "❌ bots cannot run admin commands.");
            return;
        }
        console.log(`🔧 Admin command received from ${telegramId}: ${command} ${value}`);
        bot.emit('adminCommand', { msg, command, args, value });
    });
};

export default registerMessageHandlers;
// This code registers message handlers for admin commands in a Telegram bot.
// It checks if the message is a valid admin command, verifies the user's admin status,