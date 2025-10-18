#!/bin/bash
# Telegram Webhook Setup Script
# Replace YOUR_BOT_TOKEN and YOUR_SECRET_PATH with actual values

BOT_TOKEN="YOUR_BOT_TOKEN"
VERCEL_URL="https://bonkbot-eta.vercel.app"
SECRET_PATH="YOUR_SECRET_PATH"

echo "Setting Telegram webhook..."
curl -X POST "https://api.telegram.org/bot${BOT_TOKEN}/setWebhook" \
  -d "url=${VERCEL_URL}/${SECRET_PATH}"

echo ""
echo ""
echo "Verifying webhook..."
curl "https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo"

