# 🗂️ How to Get Your Redis URL for Subtrax

Redis is used in Subtrax for caching, session management, and improving performance. Here are your options to get a Redis URL:

## 🚀 Option 1: Render Redis (Recommended for Render Deployment)

### Steps:
1. **Go to Render Dashboard**: [dashboard.render.com](https://dashboard.render.com)
2. **Create Redis Instance**:
   - Click "New" → "Redis"
   - Name: `subtrax-redis`
   - Plan: Start with "Free" tier (perfect for development/testing)
   - Region: Choose closest to your web service
3. **Get Connection Details**:
   - After creation, click on your Redis instance
   - Copy the "Redis URL" (starts with `redis://`)
   - Format: `redis://red-xxxxx:password@hostname:port`

### Example URL:
```
redis://red-abc123def:mypassword@hostname.render.com:6379
```

---

## 🌩️ Option 2: Redis Cloud (RedisLabs)

### Steps:
1. **Sign up**: Go to [redis.com](https://redis.com/try-free/)
2. **Create Free Database**:
   - Choose "Fixed" plan (30MB free)
   - Select closest region
   - Name: `subtrax-cache`
3. **Get Connection String**:
   - Go to "Databases" → Your database
   - Click "Connect" 
   - Copy the Redis URL

### Example URL:
```
redis://default:password@redis-12345.c1.us-east-1-1.ec2.cloud.redislabs.com:12345
```

---

## ⚡ Option 3: Upstash (Serverless Redis)

### Steps:
1. **Sign up**: [upstash.com](https://upstash.com)
2. **Create Database**:
   - Click "Create Database"
   - Name: `subtrax`
   - Region: Choose closest
   - Type: Regional (free tier available)
3. **Get URL**:
   - In database details, copy "Redis Connect URL"

### Example URL:
```
redis://default:password@gentle-mammal-12345.upstash.io:6379
```

---

## 🐳 Option 4: Railway

### Steps:
1. **Go to Railway**: [railway.app](https://railway.app)
2. **Create Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo" (your subtrax repo)
3. **Add Redis Service**:
   - Click "+" → "Database" → "Add Redis"
   - Name: `redis`
4. **Get URL**:
   - Click on Redis service
   - Copy the connection string from "Connect" tab

---

## 🖥️ Option 5: Local Development (Testing Only)

For local development, you can run Redis locally:

### Windows (using Docker):
```powershell
# Install Docker Desktop first
docker run -d -p 6379:6379 --name redis redis:alpine
```

### Local URL:
```
redis://localhost:6379
```

**Note**: Don't use local Redis for production!

---

## 🔧 How to Use Your Redis URL

### 1. Add to Environment Variables:

**For Render Deployment:**
- Go to your Render service dashboard
- Navigate to "Environment" tab
- Add: `REDIS_URL=your_redis_url_here`

**For Vercel:**
- Go to project settings
- Add environment variable: `REDIS_URL`

**For Local Development:**
Create `.env` file in server directory:
```bash
REDIS_URL=your_redis_url_here
```

### 2. Test Your Redis Connection:

```javascript
// Test script - save as test-redis.js
const redis = require('redis');

async function testRedis() {
  const client = redis.createClient({
    url: process.env.REDIS_URL || 'your_redis_url_here'
  });
  
  try {
    await client.connect();
    await client.set('test', 'Hello Redis!');
    const value = await client.get('test');
    console.log('✅ Redis connected successfully:', value);
    await client.disconnect();
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
  }
}

testRedis();
```

Run test:
```bash
cd server
node test-redis.js
```

---

## 💰 Pricing Comparison

| Provider | Free Tier | Paid Plans Start |
|----------|-----------|------------------|
| **Render** | ✅ Free tier available | $7/month |
| **Redis Cloud** | ✅ 30MB free | $5/month |
| **Upstash** | ✅ 10K requests/day | $0.20/100K requests |
| **Railway** | ✅ $5 credit monthly | Pay per usage |

---

## 🎯 Recommendation for Subtrax

**For Production**: Use **Render Redis** if deploying to Render, or **Redis Cloud** for other platforms.

**For Development**: **Upstash** has a generous free tier perfect for testing.

---

## 🔄 Is Redis Required?

Redis is **optional** for Subtrax basic functionality. The application will work without it, but you'll get these benefits with Redis:

- ✅ **Faster response times** (caching)
- ✅ **Session persistence** 
- ✅ **Rate limiting** for API protection
- ✅ **Background job processing**

You can deploy without Redis initially and add it later when you need the performance boost!

---

## 🚨 Security Notes

- ✅ Always use the full connection string with authentication
- ✅ Keep your Redis URL in environment variables (never in code)
- ✅ Use SSL/TLS connections in production
- ❌ Never expose Redis ports publicly without authentication

## Next Steps

1. Choose your Redis provider
2. Create Redis instance  
3. Copy the Redis URL
4. Add to your deployment environment variables
5. Test the connection

**Your Redis URL will look like**: `redis://username:password@hostname:port`