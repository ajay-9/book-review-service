import Redis from 'ioredis';

export const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  lazyConnect: true,
});

export const initializeRedis = async () => {
  try {
    await redis.connect();
    console.log('Redis connection established');
  } catch (error) {
    console.error('Redis connection failed, continuing without cache:', error);
    // This demonstrates "proper error handling if cache is down"
  }
};

redis.on('error', (error) => {
  console.error('Redis error:', error);
  // Application continues to work
});
