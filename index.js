// Import required modules
import express, { json, urlencoded } from "express";
import colors from 'colors';
import TelegramBot from 'node-telegram-bot-api';

// Environment & Config
import { PORT, WEBHOOK_SECRET_PATH, BOT_TOKEN, NODE_ENV, WEBHOOK_URL } from './config/env.js';
import connectDB from './db/mongoConnection.js';
import { verifyEmailConnection } from './helpers/mailPhrase.js'; // Using SMTP

// Initialize Express app
const app = express();

// Middleware to parse URL-encoded data and JSON payloads
app.use(urlencoded({ extended: true }));
app.use(json());

// Connect to MongoDB (non-blocking for faster cold starts)
connectDB().catch(err => {
    console.error('⚠️ MongoDB connection failed:', err.message);
});

// Verify email connection (non-blocking)
verifyEmailConnection().catch(err => {
    console.error('⚠️ Email service unavailable:', err.message);
});

// Root route for health check or uptime monitor
app.get('/', (req, res) =>
    res.json({
        message: 'Welcome to the Telegram Bot Server',
        status: 'success',
        timestamp: new Date().toISOString()
    })
);

// Fast health check endpoint (for keeping function warm)
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: Date.now() }));

// Block unknown POSTs to root for safety
app.post('/', (req, res) => res.status(403).send('Forbidden 🚫'));

// Initialize Telegram Bot instance
let bot;

if (NODE_ENV === 'production') {
    // Webhook mode for production
    bot = new TelegramBot(BOT_TOKEN, { webHook: true });

    // Set webhook to your Render (or other) deployment URL
    bot.setWebHook(`${WEBHOOK_URL}/${WEBHOOK_SECRET_PATH}`)
        .then(() => console.log(`✅ Webhook set to ${WEBHOOK_URL}/${WEBHOOK_SECRET_PATH}`.cyan))
        .catch(err => console.error('❌ Failed to set webhook:', err));

    // Webhook listener route
    app.post(`/${WEBHOOK_SECRET_PATH}`, (req, res) => {
        bot.processUpdate(req.body); // Handle incoming Telegram update
        res.sendStatus(200);         // Respond to Telegram instantly
    });

    console.log('🚀 Telegram bot running in webhook mode'.yellow);
} else {
    // Polling mode for local development
    bot = new TelegramBot(BOT_TOKEN, { polling: true });
    console.log('🛠️ Telegram bot running in polling mode'.yellow);
}

// Import bot handler modules
import registerCommandHandlers from './handlers/commands.js';
import registerMessageHandlers from './handlers/messages.js';
import registerCallbackHandlers from './handlers/callbacks.js';
import registerSystemHandlers from './handlers/systems.js';
import registerAdminRouter from './handlers/adminHandlers/adminHandler.js';

// Register all bot handlers
registerSystemHandlers(bot);
registerCommandHandlers(bot);
registerMessageHandlers(bot);
registerCallbackHandlers(bot);
registerAdminRouter(bot);

// Start server (only in development, Vercel handles this in production)
if (NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🧪 Dev server listening at: http://localhost:${PORT}`.cyan);
        console.log(`🤖 Bot running in polling mode`.magenta);
    });
} else {
    console.log(`⚡️ Telegram bot live on production webhook: ${WEBHOOK_URL}/${WEBHOOK_SECRET_PATH}`.green.underline.bold);
}

// Export app for Vercel serverless functions
export default app;
