import { redis } from '../config/redis';

export class CacheService {
  private static readonly DEFAULT_TTL = parseInt(process.env.CACHE_TTL || '300');
  private static isRedisAvailable = true;
  private static lastErrorTime = 0;
  private static ERROR_LOG_INTERVAL = 30000; // Log errors max once per 30 seconds

  static async get<T>(key: string): Promise<T | null> {
    if (!this.isRedisAvailable) return null;
    
    try {
      const cached = await redis.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      this.handleCacheError('Cache get error');
      return null;
    }
  }

  static async set(key: string, value: any, ttl: number = this.DEFAULT_TTL): Promise<void> {
    if (!this.isRedisAvailable) return;
    
    try {
      await redis.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      this.handleCacheError('Cache set error');
    }
  }

  static async del(key: string): Promise<void> {
    if (!this.isRedisAvailable) return;
    
    try {
      await redis.del(key);
    } catch (error) {
      this.handleCacheError('Cache delete error');
    }
  }

  static async invalidatePattern(pattern: string): Promise<void> {
    if (!this.isRedisAvailable) return;
    
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      this.handleCacheError('Cache invalidate error');
    }
  }

  private static handleCacheError(operation: string): void {
    const now = Date.now();
    if (now - this.lastErrorTime > this.ERROR_LOG_INTERVAL) {
      console.error(`${operation} - Redis unavailable !!, using database fallback`);
      this.lastErrorTime = now;
    }
    this.isRedisAvailable = false;
    
    // Try to re-enable Redis after 30 seconds
    setTimeout(() => {
      this.isRedisAvailable = true;
    }, this.ERROR_LOG_INTERVAL);
  }
}
