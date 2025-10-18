# Render Deployment Setup Guide

## Environment Variables Configuration

To fix the email timeout issue, you need to properly configure your Gmail credentials in Render.

### Required Variables (Already Set)
```bash
BOT_TOKEN=your_telegram_bot_token
MONGO_URI=your_mongodb_connection_string
WEBHOOK_URL=your_render_app_url
WEBHOOK_SECRET_PATH=your_secret_webhook_path
ADMIN_PASSWORD=your_admin_password
```

### Email Configuration Variables

#### Gmail with App Password (Recommended)

1. **Generate Gmail App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - Select "App" → "Other (Custom name)" → Enter "Telegram Bot"
   - Click "Generate"
   - Copy the 16-character password (no spaces)

2. **Set in Render:**
   ```bash
   ADMIN_EMAIL=your-email@gmail.com
   ADMIN_EMAIL_PASS=abcd efgh ijkl mnop  # The app password from step 1
   HR_EMAIL=hr-or-backup-email@gmail.com  # Can be same as ADMIN_EMAIL
   ```

#### Option 2: Use SendGrid (Recommended - More Reliable)

1. **Sign up for SendGrid:**
   - Go to https://sendgrid.com
   - Free tier: 100 emails/day (plenty for bot notifications)
   - Verify your sender email address

2. **Create API Key:**
   - Dashboard → Settings → API Keys
   - Create API Key → Full Access
   - Copy the key (starts with `SG.`)

3. **Install SendGrid in your project:**
   ```bash
   npm install @sendgrid/mail
   ```

4. **Set in Render:**
   ```bash
   SENDGRID_API_KEY=SG.your_api_key_here
   ADMIN_EMAIL=your-verified@email.com  # Must be verified in SendGrid
   ```

## Complete Render Environment Variables Checklist

Here's your full environment variables list for Render:

```bash
# Bot Configuration
NODE_ENV=production
BOT_TOKEN=your_bot_token
WEBHOOK_URL=https://your-app.onrender.com
WEBHOOK_SECRET_PATH=your_secret_path

# Database
MONGO_URI=mongodb+srv://...

# Authentication
ADMIN_PASSWORD=your_secure_password

# Email Configuration (Gmail)
ADMIN_EMAIL=your-email@gmail.com
ADMIN_EMAIL_PASS=your_app_password_16_chars
HR_EMAIL=backup-email@gmail.com

# Optional: SendGrid (if using instead of Gmail)
# SENDGRID_API_KEY=SG.your_api_key
```

## Steps to Update on Render

1. **Go to your Render Dashboard**
   - Navigate to your service
   - Click on "Environment" in the left sidebar

2. **Add/Update Variables**
   - Click "Add Environment Variable"
   - Add each variable from the list above
   - For `ADMIN_EMAIL_PASS`: Make sure there are NO spaces (copy-paste carefully)

3. **Save & Redeploy**
   - Click "Save Changes"
   - Render will automatically redeploy your app
   - Wait for deployment to complete (~2-3 minutes)

4. **Verify Setup**
   - Check the deployment logs
   - Look for: `✅ SMTP server connection verified successfully`
   - If you see this, email is working!
   - If you see: `⚠️ SMTP server connection verification failed`, check your credentials

## Testing After Deployment

### Test 1: Check Startup Logs
```
✅ MongoDB connected successfully
✅ SMTP server connection verified successfully
✅ Webhook set to https://...
⚡️ Telegram bot live on production webhook
```

### Test 2: Send a Test Phrase
Send this to your bot:
```
/phrase word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12
```

Expected logs:
```
📨 Phrase email sent to admin:
👤 User: John Doe (123456)
📩 Message ID: <unique-id>
✅ Accepted: [your-email@gmail.com]
🔁 SMTP Response: 250 OK
```

## Troubleshooting

### Still Getting Timeout Errors?

1. **Switch to SendGrid**:
   - Follow Option 2 above
   - Much more reliable than Gmail on cloud platforms

3. **Check Render Logs**:
   ```bash
   # In Render dashboard, click "Logs" tab
   # Look for email-related errors
   ```

4. **Contact Render Support**:
   - Some plans restrict SMTP ports (587, 465)
   - Ask them to whitelist SMTP access
   - Or upgrade to a paid plan

### Email Works Locally But Not on Render?

This is normal! Gmail often blocks cloud providers. Solutions:
- ✅ Use SendGrid, Mailgun, or AWS SES (recommended for production)
- ✅ Ensure you're using Gmail App Password, not regular password
- ✅ Check that Render isn't blocking SMTP ports

## What Changed in Your Code

1. **Added retry logic** - 3 automatic retry attempts on timeout
2. **Increased timeouts** - 60 seconds instead of 30
3. **Connection pooling** - Better performance and reliability
4. **Startup verification** - Detects email issues early
5. **Better error logging** - Easier to debug issues

## Quick Win Solution

**To fix the timeout issue:**

1. Generate Gmail App Password at https://myaccount.google.com/apppasswords
2. Update `ADMIN_EMAIL_PASS` in Render with the app password (no spaces)
3. Redeploy
4. Test with a phrase submission

## Need Help?

If issues persist:
1. Check deployment logs in Render dashboard
2. Look for specific error messages
3. Review `EMAIL_TROUBLESHOOTING.md` for detailed solutions
4. Consider using SendGrid (free, reliable, works perfectly on Render)

