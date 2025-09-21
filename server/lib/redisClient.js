const Redis = require('ioredis');

const redisUrl = process.env.REDIS_URL || null;
let redis = null;
if (redisUrl) {
  redis = new Redis(redisUrl);
  redis.on('error', (err) => console.error('Redis error', err));
} else {
  console.info('REDIS_URL not set; Redis client will not be initialized.');
}

module.exports = redis;