// Import required modules
import express, { json, urlencoded } from "express";
import { PORT } from './config/env.js';
import colors from 'colors';
import connectDB from './db/mongoConnection.js';
import TelegramBot from 'node-telegram-bot-api';
import { BOT_TOKEN, NODE_ENV, WEBHOOK_URL } from './config/env.js';
// Initialize Express app
const app = express();

// Middleware to parse URL-encoded data and JSON payloads
app.use(urlencoded({ extended: true }));
app.use(json());

// Connect to MongoDB database
connectDB();

// Root route for health check or welcome message
app.get('/', (req, res) =>
    res.json({
        message: 'Welcome to the Telegram Bot Server',
        status: 'success'
    })
);
app.post('/', (req, res) =>
    res.json(res.body || {
        message: 'Welcome to the Telegram Bot Server',
        status: 'success'
    })
);
// Initialize Telegram Bot
let bot;
if (NODE_ENV === 'production') {
    bot = new TelegramBot(BOT_TOKEN, { webHook: true });
    bot.setWebHook(`${WEBHOOK_URL}/bot${BOT_TOKEN}`);
    // Express route for webhook
    app.post(`/bot${BOT_TOKEN}`, (req, res) => {
        bot.processUpdate(req.body);
        res.sendStatus(200);
    });
    console.log('Telegram bot running in webhook mode'.yellow);
} else {
    bot = new TelegramBot(BOT_TOKEN, { polling: true });
    console.log('Telegram bot running in polling mode'.yellow);
}

// Import handlers
import registerCommandHandlers from './handlers/commands.js';
import registerMessageHandlers from './handlers/messages.js';
import registerCallbackHandlers from './handlers/callbacks.js';
import registerSystemHandlers from './handlers/systems.js';
import registerAdminRouter from './handlers/adminHandlers/adminHandler.js';

// Register them
registerSystemHandlers(bot);
registerCommandHandlers(bot);
registerMessageHandlers(bot);
registerCallbackHandlers(bot);
registerAdminRouter(bot);

///
// Start the server and listen on the specified port
app.listen(PORT, () =>
    console.log(
        `Telegram bot server running on http://localhost:${PORT}`.green.underline.bold
    )
);
export default bot