import { ADMIN_PASSWORD } from '../../config/env.js';
import deleteUser from '../../db/methods/deleteMethods/deleteUser.js';
import checkAdmin from '../../db/methods/ReadMethods/checkAdmin.js';
import getUser from '../../db/methods/ReadMethods/getUser.js';
import revokeAdmin from '../../db/methods/UpdateMethods/revokeAdmin.js';
import updateUserBalance from '../../db/methods/UpdateMethods/updateUserBalance.js';
import toggleAdminStatus from '../../db/methods/UpdateMethods/upgradeToAdmin.js';
import { adminMenu } from '../menus.js';

const registerAdminRouter = (bot) => {
    bot.on('adminCommand', async ({ msg, command, args, value }) => {
        const {
            from: {
                id: telegram_id,
                first_name,
            },
            chat: {
                id: chatId,
            }
        } = msg;
        const isAdmin = await checkAdmin(telegram_id);
        switch (command) {
            case 'adminLogin': {
                try {
                    const isCorrectPassword = value === ADMIN_PASSWORD;

                    // Step 1: Validate password
                    if (!isCorrectPassword) {
                        bot.sendMessage(chatId, `❌ Incorrect password ${first_name}. Please try again.`);
                        return;
                    }

                    // Step 2: Check if user is already an admin
                    const isAdmin = await checkAdmin(telegram_id);
                    if (isAdmin) {
                        bot.sendMessage(chatId, `🔐 You are already logged in as an admin ${first_name}.`);
                        return;
                    }

                    // Step 3: Promote to admin
                    const upgradedUser = await toggleAdminStatus(telegram_id);
                    if (!upgradedUser || !upgradedUser.is_admin) {
                        bot.sendMessage(chatId, `❌ Failed to grant admin rights. Please try again later.`);
                        return;
                    }

                    // Step 4: Success message
                    bot.sendMessage(chatId, `✅ Successfully logged in as admin ${first_name}!`, {
                        reply_markup: adminMenu.reply_markup,
                        parse_mode: "HTML",
                        disable_web_page_preview: true
                    });
                } catch (error) {
                    console.error('🔥 Error in adminLogin handler:', {
                        message: error.message || error,
                        stack: error.stack || 'No stack trace',
                    });

                    bot.sendMessage(chatId, '⚠️ An unexpected error occurred while logging in as admin. Please try again later.');
                }

                break;
            }
            case 'adminLogout':
                if (!isAdmin) {
                    bot.sendMessage(chatId, "🚫 You don't have admin rights to run this command.");
                    return;
                }
                const downgradedUser = await toggleAdminStatus(telegram_id);
                if (!downgradedUser || downgradedUser.is_admin) {
                    bot.sendMessage(chatId, `❌ Failed to revoke admin rights. Please try again later.`);
                    return;
                }
                bot.sendMessage(chatId, `✅ Admin rights revoked successfully.`);
                break;
            case 'adminMenu':
                if (!isAdmin) {
                    bot.sendMessage(msg.chat.id, "🚫 You don't have admin rights to run this command.");
                    return;
                }
                bot.sendMessage(
                    chatId, '📋 Here’s your admin menu...',
                    {
                        reply_markup: adminMenu.reply_markup,
                        parse_mode: "HTML",
                        disable_web_page_preview: true
                    }
                ); break;
            case 'adminRevoke':
                if (!isAdmin) {
                    bot.sendMessage(chatId, "🚫 You don't have admin rights to run this command.");
                    return;
                }
                const revokedUser = await revokeAdmin(value);
                if (!revokedUser || revokedUser.is_admin) {
                    bot.sendMessage(chatId, `❌ Failed to revoke admin rights. Please try again later.`);
                    return;
                }
                bot.sendMessage(chatId, '🛑 Admin rights revoked.');
                break;
            case 'adminGetUser': {
                // Make sure only admins can run this
                if (!isAdmin) {
                    bot.sendMessage(chatId, "🚫 You don't have admin rights to run this command.");
                    return;
                }

                // Validate user ID input
                if (!value || isNaN(Number(value))) {
                    bot.sendMessage(chatId, "❌ Please provide a valid Telegram ID after the command.\nExample: <code>adminGetUser 123456789</code>", { parse_mode: 'HTML' });
                    return;
                }

                // Fetch the user
                const user = await getUser(value);
                if (!user) {
                    bot.sendMessage(chatId, `❌ No user found with Telegram ID <code>${value}</code>.`, { parse_mode: 'HTML' });
                    return;
                }

                // Destructure and safely access values
                const {
                    telegram_id,
                    first_name,
                    last_name,
                    is_admin,
                    wallet,
                    updatedAt
                } = user;

                const message =
                    `👤 <b>${first_name} ${last_name || ''}</b>\n` +
                    `🆔 ID: <code>${telegram_id}</code>\n` +
                    `🛡️ Admin: ${is_admin ? '✅' : '❌'}\n` +
                    `💼 Wallet Imported: ${wallet?.imported ? '✅' : '❌'}\n` +
                    `💰 SOL Balance: ${wallet?.SOL_balance ?? 0}\n` +
                    `🕒 Last Updated: <i>${new Date(updatedAt).toLocaleString()}</i>`;

                // Send formatted message
                bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
                break;
            }
            case 'adminDeleteUser': {
                if (!isAdmin) {
                    return bot.sendMessage(chatId, "🚫 You don't have admin rights to run this command.");
                }

                // Validate user ID input
                if (!value || isNaN(Number(value))) {
                    return bot.sendMessage(
                        chatId,
                        "❌ Please provide a valid Telegram ID after the command.\n\n" +
                        "Example: <code>adminDeleteUser 123456789</code>",
                        { parse_mode: 'HTML' }
                    );
                }

                const deletedUser = await deleteUser(Number(value));

                if (!deletedUser) {
                    return bot.sendMessage(chatId, `❌ Failed to delete user with ID: <code>${value}</code>`, { parse_mode: 'HTML' });
                }

                bot.sendMessage(chatId, `✅ Successfully deleted user with ID: <code>${value}</code>`, { parse_mode: 'HTML' });
                break;
            }
            case 'adminUpdateUserBalance': {
                if (!isAdmin) {
                    return bot.sendMessage(chatId, "🚫 You don't have admin rights to run this command.");
                }

                const telegramId = Number(args[0]);
                const newBalance = parseFloat(args[1]);

                // Validate Telegram ID
                if (!telegramId || isNaN(telegramId)) {
                    return bot.sendMessage(
                        chatId,
                        "❌ Please provide a valid Telegram ID.\n\nExample: <code>adminUpdateUserBalance 123456789 1233.312</code>",
                        { parse_mode: 'HTML' }
                    );
                }

                // Validate balance
                if (isNaN(newBalance) || newBalance < 0) {
                    return bot.sendMessage(
                        chatId,
                        "❌ Please provide a valid non-negative balance.\n\nExample: <code>adminUpdateUserBalance 123456789 1233.312</code>",
                        { parse_mode: 'HTML' }
                    );
                }

                try {
                    const updatedUser = await updateUserBalance(telegramId, newBalance);

                    if (!updatedUser) {
                        return bot.sendMessage(
                            chatId,
                            `❌ Failed to update balance. User with ID <code>${telegramId}</code> might not exist.`,
                            { parse_mode: 'HTML' }
                        );
                    }

                    bot.sendMessage(
                        chatId,
                        `✅ Balance updated successfully for user <code>${telegramId}</code>.\nNew Balance: <b>${newBalance}</b> SOL`,
                        { parse_mode: 'HTML' }
                    );
                } catch (error) {
                    console.error("updateUserBalance error:", error);
                    bot.sendMessage(chatId, "❌ Something went wrong while updating the balance. Please try again.");
                }
                break;
            }
            default:
                bot.sendMessage(chatId, "⚠️ Unknown admin command.");
                break;
        }
    });
};

export default registerAdminRouter;
// This code registers an admin command handler for a Telegram bot.
// It listens for admin commands and executes corresponding actions based on the command received.