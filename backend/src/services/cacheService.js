// backend/src/services/cacheService.js
import Redis from 'ioredis';

// Redis client
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  connectTimeout: 10000,
});

redis.on('error', (err) => {
  console.log('Redis connection error:', err.message);
});

redis.on('connect', () => {
  console.log('Connected to Redis');
});

// Cache configuration
const CACHE_TTL = 3600; // 1 hour in seconds

// Generate cache key from parameters
const generateCacheKey = (params) => {
  return `pickup:${params.identity}:${params.interest}:${params.style}:${params.language || 'myanmar'}`;
};

// Get cached result
export const getCachedResult = async (params) => {
  try {
    const key = generateCacheKey(params);
    const cached = await redis.get(key);
    if (cached) {
      console.log(`Cache hit for key: ${key}`);
      return JSON.parse(cached);
    }
    console.log(`Cache miss for key: ${key}`);
    return null;
  } catch (error) {
    console.log('Cache get error:', error.message);
    return null;
  }
};

// Set cached result
export const setCachedResult = async (params, result) => {
  try {
    const key = generateCacheKey(params);
    await redis.setex(key, CACHE_TTL, JSON.stringify(result));
    console.log(`Cached result for key: ${key}`);
    return true;
  } catch (error) {
    console.log('Cache set error:', error.message);
    return false;
  }
};

// Clear cache for a specific pattern
export const clearCache = async (pattern = 'pickup:*') => {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`Cleared ${keys.length} cache entries`);
    }
    return true;
  } catch (error) {
    console.log('Cache clear error:', error.message);
    return false;
  }
};

export default redis;
