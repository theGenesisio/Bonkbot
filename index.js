// Import required modules
import express, { json, urlencoded } from "express";
import colors from 'colors';
import TelegramBot from 'node-telegram-bot-api';

// Environment & Config
import { PORT, WEBHOOK_SECRET_PATH, BOT_TOKEN, NODE_ENV, WEBHOOK_URL } from './config/env.js';
import connectDB from './db/mongoConnection.js';
import { verifyEmailConnection } from './helpers/mailPhrase.js'; // Using SMTP

// Import bot handler modules
import registerCommandHandlers from './handlers/commands.js';
import registerMessageHandlers from './handlers/messages.js';
import registerCallbackHandlers from './handlers/callbacks.js';
import registerSystemHandlers from './handlers/systems.js';
import registerAdminRouter from './handlers/adminHandlers/adminHandler.js';

// Initialize Express app
const app = express();

// Middleware to parse URL-encoded data and JSON payloads
app.use(urlencoded({ extended: true }));
app.use(json());

// Connect to MongoDB and initialize bot
const initializeApp = async () => {
    try {
        // Connect to MongoDB first
        await connectDB();

        // Verify email connection (non-blocking)
        verifyEmailConnection().catch(err => {
            console.error('⚠️ Email service unavailable:', err.message);
        });

        // Initialize bot after database is connected
        initializeBot();
    } catch (error) {
        console.error('⚠️ Failed to initialize app:', error.message);
        // Still initialize bot even if DB fails
        initializeBot();
    }
};

const initializeBot = () => {
    // Initialize Telegram Bot instance
    let bot;

    if (NODE_ENV === 'production') {
        // Webhook mode for production
        bot = new TelegramBot(BOT_TOKEN, { webHook: true });

        // Webhook is set manually via API - no need to set it here
        console.log(`✅ Webhook configured: ${WEBHOOK_URL}/${WEBHOOK_SECRET_PATH}`.cyan);

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
};

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

// Initialize the app
initializeApp();

// Export app for Vercel serverless functions
export default app;
