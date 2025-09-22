// Test Redis Connection for Subtrax
// Run this script to test your Redis URL before deployment

const Redis = require('ioredis');

async function testRedisConnection() {
    console.log('🔍 Testing Redis Connection for Subtrax...\n');
    
    // Get Redis URL from environment or prompt user
    const redisUrl = process.env.REDIS_URL;
    
    if (!redisUrl) {
        console.log('❌ REDIS_URL not found in environment variables');
        console.log('💡 To test your Redis URL:');
        console.log('   1. Set environment variable: set REDIS_URL=your_redis_url');
        console.log('   2. Or edit this file and replace the URL below');
        console.log('   3. Run: node test-redis-connection.js\n');
        
        // Uncomment and replace with your Redis URL for testing
        // const testUrl = 'redis://your_redis_url_here';
        // testRedisConnection(testUrl);
        return;
    }
    
    console.log(`🔗 Connecting to: ${redisUrl.replace(/:[^:@]*@/, ':***@')}`);
    
    try {
        // Create Redis client
        const redis = new Redis(redisUrl);
        
        // Test connection
        await redis.ping();
        console.log('✅ Redis connection successful!');
        
        // Test basic operations
        console.log('\n🧪 Testing Redis operations...');
        
        // Set a test key
        await redis.set('subtrax:test', 'Hello from Subtrax!', 'EX', 60);
        console.log('✅ SET operation successful');
        
        // Get the test key
        const value = await redis.get('subtrax:test');
        console.log(`✅ GET operation successful: ${value}`);
        
        // Test hash operations (used for user sessions)
        await redis.hset('subtrax:user:test', 'name', 'Test User', 'email', 'test@example.com');
        console.log('✅ HSET operation successful');
        
        const userData = await redis.hgetall('subtrax:user:test');
        console.log('✅ HGETALL operation successful:', userData);
        
        // Clean up test data
        await redis.del('subtrax:test', 'subtrax:user:test');
        console.log('✅ Cleanup successful');
        
        // Get Redis info
        const info = await redis.info('memory');
        const memoryUsage = info.split('\n').find(line => line.startsWith('used_memory_human:'));
        if (memoryUsage) {
            console.log(`📊 Redis memory usage: ${memoryUsage.split(':')[1].trim()}`);
        }
        
        console.log('\n🎉 All Redis tests passed! Your Redis instance is ready for Subtrax.');
        
        await redis.disconnect();
        
    } catch (error) {
        console.error('❌ Redis connection failed:', error.message);
        console.log('\n🔧 Troubleshooting tips:');
        console.log('   • Check if Redis URL is correct');
        console.log('   • Verify Redis server is running');
        console.log('   • Check network connectivity');
        console.log('   • Ensure authentication credentials are correct');
        console.log('   • Try connecting from Redis CLI: redis-cli -u "your_url"');
    }
}

// Auto-run if this file is executed directly
if (require.main === module) {
    testRedisConnection();
}

module.exports = testRedisConnection;