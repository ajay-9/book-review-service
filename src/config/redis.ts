import Redis from 'ioredis';

export const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  lazyConnect: true,
  enableOfflineQueue: false,
  maxRetriesPerRequest: 0,
  connectTimeout: 5000,
});

let redisConnected = false;
let errorLogged = false;

export const initializeRedis = async () => {
  try {
    await redis.connect();
    redisConnected = true;
    console.log('Redis connection established');
  } catch (error) {
    redisConnected = false;
    if (!errorLogged) {
      console.error('Redis connection failed !!, continuing without cache');
      errorLogged = true;
    }
  }
};

redis.on('error', (error) => {
  if (!errorLogged) {
    console.error('Redis unavailable !!- operating in database-only mode');
    errorLogged = true;
    redisConnected = false;
  }
});

redis.on('connect', () => {
  console.log('Redis reconnected');
  redisConnected = true;
  errorLogged = false;
});

redis.on('close', () => {
  if (redisConnected && !errorLogged) {
    console.log('Redis connection closed !!');
    redisConnected = false;
  }
});

export const isRedisConnected = () => redisConnected;
