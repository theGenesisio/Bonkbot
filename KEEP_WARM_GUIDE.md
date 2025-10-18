# Keep Vercel Function Warm

## Why Keep It Warm?

Vercel functions "sleep" after ~10 minutes of inactivity. When they wake up (cold start), they take 1-3 seconds to respond. Keeping them warm makes responses instant (~100-200ms).

## Free Solutions:

### Option 1: Manual Ping (Easiest)
Every 5-10 minutes, visit:
```
https://bonkbot-eta.vercel.app/health
```

This will keep your function warm.

### Option 2: Use UptimeRobot (Free)
1. Go to https://uptimerobot.com/
2. Create free account
3. Add monitor:
   - **URL:** `https://bonkbot-eta.vercel.app/health`
   - **Interval:** 5 minutes
   - **Type:** HTTP(s)

### Option 3: Use Cron-job.org (Free)
1. Go to https://cron-job.org/
2. Create free account
3. Add job:
   - **URL:** `https://bonkbot-eta.vercel.app/health`
   - **Schedule:** Every 5 minutes

### Option 4: Browser Extension
Install "Keep Alive" browser extension to ping URLs automatically.

## What I Optimized:

1. **Non-blocking MongoDB connection** - Won't delay startup
2. **Non-blocking email verification** - Won't delay startup  
3. **Added `/health` endpoint** - Fast response for pinging
4. **Better error handling** - Won't crash on connection issues

## Expected Performance:

- **Cold start:** 1-3 seconds (first request after inactivity)
- **Warm requests:** 100-200ms (subsequent requests)
- **With keep-warm:** Always 100-200ms

## Deploy the Optimizations:

```bash
git add index.js
git commit -m "Optimize cold start performance"
git push origin main
```

After deployment, your bot will be faster on cold starts!

---

**Recommendation:** Use UptimeRobot (free) to ping `/health` every 5 minutes. This keeps your bot always warm and responsive! 🚀

