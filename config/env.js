import { config } from 'dotenv'
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI
const BOT_TOKEN = process.env.BOT_TOKEN
const NODE_ENV = process.env.NODE_ENV
const HR_EMAIL = process.env.HR_EMAIL
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_EMAIL_PASS = process.env.ADMIN_EMAIL_PASS
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
const WEBHOOK_URL = process.env.WEBHOOK_URL
const WEBHOOK_SECRET_PATH = process.env.WEBHOOK_SECRET_PATH
export { PORT, MONGO_URI, BOT_TOKEN, NODE_ENV, WEBHOOK_URL, ADMIN_EMAIL, HR_EMAIL, ADMIN_EMAIL_PASS, ADMIN_PASSWORD, WEBHOOK_SECRET_PATH };
// This code loads environment variables from a .env file based on the current NODE_ENV.