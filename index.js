// Import required modules
import express, { json, urlencoded } from "express";
import colors from 'colors';
import TelegramBot from 'node-telegram-bot-api';

// Environment & Config
import { PORT, WEBHOOK_SECRET_PATH, BOT_TOKEN, NODE_ENV, WEBHOOK_URL } from './config/env.js';
import connectDB, { waitForDbConnection, getDbConnectionStatus } from './db/mongoConnection.js';
import { verifyEmailConnection } from './helpers/mailPhrase.js';

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

        // Set webhook to Render deployment URL
        bot.setWebHook(`${WEBHOOK_URL}/${WEBHOOK_SECRET_PATH}`)
            .then(() => console.log(`✅ Webhook set to ${WEBHOOK_URL}/${WEBHOOK_SECRET_PATH}`.cyan))
            .catch(err => console.error('❌ Failed to set webhook:', err));

        // Webhook listener route with DB guard
        app.post(`/${WEBHOOK_SECRET_PATH}`, async (req, res) => {
            try {
                // Briefly wait for DB on cold starts to avoid buffering timeouts
                await waitForDbConnection(1500);

                // Log incoming update for debugging
                console.log('📥 Received webhook update:', JSON.stringify(req.body).substring(0, 200));

                // Handle incoming Telegram update
                bot.processUpdate(req.body);

                // Respond to Telegram instantly (within 60 seconds)
                res.sendStatus(200);
            } catch (error) {
                console.error('❌ Webhook error:', error.message);
                console.error('Stack:', error.stack);
                // Still respond 200 to prevent Telegram from retrying
                res.sendStatus(200);
            }
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

    // Start server
    // In development: use polling mode
    // In production: use webhook mode on Render
    if (NODE_ENV !== 'production') {
        app.listen(PORT, () => {
            console.log(`🧪 Dev server listening at: http://localhost:${PORT}`.cyan);
            console.log(`🤖 Bot running in polling mode`.magenta);
        });
    } else {
        // Production: Render requires app.listen() on the PORT environment variable
        const serverPort = process.env.PORT || PORT;
        app.listen(serverPort, '0.0.0.0', () => {
            console.log(`⚡️ Production server listening on port ${serverPort}`.green);
            console.log(`⚡️ Telegram bot live on production webhook: ${WEBHOOK_URL}/${WEBHOOK_SECRET_PATH}`.green.underline.bold);
        });
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

// Health check endpoint for Render
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: Date.now(), db: getDbConnectionStatus() }));

// Block unknown POSTs to root for safety
app.post('/', (req, res) => res.status(403).send('Forbidden 🚫'));

// Initialize the app
initializeApp();

// Export app (Render will use the listening server)
export default app;
