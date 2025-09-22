// Quick Redis URL Test for Subtrax
// Replace the URL below with your Redis URL and run this script

const Redis = require('ioredis');

async function quickTest() {
    // REPLACE THIS URL with your Redis URL from ri.redis.io
    const YOUR_REDIS_URL = 'redis://default:your_password@redis-13581751.c1.region.ec2.cloud.redislabs.com:13581';
    
    console.log('🔍 Testing Redis URL from ri.redis.io...');
    console.log(`🔗 URL: ${YOUR_REDIS_URL.replace(/:[^:@]*@/, ':***@')}`);
    
    try {
        const redis = new Redis(YOUR_REDIS_URL);
        
        // Test connection
        const result = await redis.ping();
        console.log('✅ Connection successful!', result);
        
        // Test basic operation
        await redis.set('subtrax:test', 'Connected from Subtrax!');
        const value = await redis.get('subtrax:test');
        console.log('✅ Read/Write test:', value);
        
        // Clean up
        await redis.del('subtrax:test');
        console.log('✅ Your Redis is ready for Subtrax deployment!');
        
        await redis.disconnect();
        
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.log('\n💡 Tips:');
        console.log('   • Check if the URL is complete with password');
        console.log('   • Verify the host and port are correct');
        console.log('   • Make sure your Redis instance is active');
    }
}

// Uncomment and run this to test
// quickTest();

console.log('📝 To test your Redis URL:');
console.log('1. Replace YOUR_REDIS_URL with your actual URL');
console.log('2. Uncomment the quickTest() call at the bottom');
console.log('3. Run: node quick-redis-test.js');