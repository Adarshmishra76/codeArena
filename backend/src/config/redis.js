
const { createClient } = require('redis');

const redisclient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'macroglossy-enormous-apparatus-32656.db.redis.io',
        port: 10793,
        connectTimeout: 30000,
        timeout: 30000,
        keepAlive: 30000,
        reconnectStrategy: (retries) => {
            console.log(`🔄 Redis reconnect attempt ${retries}`);
            if (retries > 50) {
                console.log('❌ Redis connection retry limit reached');
                return new Error('Redis connection failed');
            }
            return Math.min(retries * 100, 5000);
        },
    },
});

redisclient.isReady = false;

redisclient.on('connect', () => {
    console.log('✅ Redis connected');
    redisclient.isReady = true;
});

redisclient.on('ready', () => {
    console.log('✅ Redis is ready');
    redisclient.isReady = true;
});

redisclient.on('error', (err) => {
    console.error('❌ Redis error:', err.message);
    redisclient.isReady = false;
    // Don't crash the app
});

redisclient.on('end', () => {
    console.log('⚠️ Redis connection ended');
    redisclient.isReady = false;
});

redisclient.on('reconnecting', () => {
    console.log('🔄 Redis reconnecting...');
});

// ✅ Auto-reconnect if Redis fails

redisclient.on('error', async (err) => {
    if (err.code === 'ECONNRESET' || err.code === 'ECONNREFUSED') {
        console.log('⚠️ Redis disconnected, attempting to reconnect...');

        setTimeout(async () => {
            try {
                await redisclient.connect();
                console.log('✅ Redis reconnected successfully');
            } catch (e) {
                console.log('❌ Redis reconnection failed:', e.message);
            }
        }, 5000);
    }
});
module.exports = redisclient;