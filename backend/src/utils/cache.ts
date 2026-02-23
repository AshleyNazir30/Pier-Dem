import Redis from "ioredis";
import { DEFAULT_CACHE_TTL, REDIS_KEY_PREFIX } from "../config/constants";

export { CACHE_TTL, CACHE_KEYS } from "../config/constants";

interface ICache {
  get<T>(key: string): Promise<T | undefined>;
  set<T>(key: string, data: T, ttlSeconds?: number): Promise<void>;
  delete(key: string): Promise<boolean>;
  deleteByPrefix(prefix: string): Promise<number>;
  clear(): Promise<void>;
}

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class MemoryCache implements ICache {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private defaultTTL: number;

  constructor(defaultTTLSeconds: number = DEFAULT_CACHE_TTL) {
    this.defaultTTL = defaultTTLSeconds * 1000;
  }

  async get<T>(key: string): Promise<T | undefined> {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) {
      return undefined;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.data;
  }

  async set<T>(key: string, data: T, ttlSeconds?: number): Promise<void> {
    const ttl = ttlSeconds ? ttlSeconds * 1000 : this.defaultTTL;
    const entry: CacheEntry<T> = {
      data,
      expiresAt: Date.now() + ttl,
    };
    this.cache.set(key, entry);
  }

  async delete(key: string): Promise<boolean> {
    return this.cache.delete(key);
  }

  async deleteByPrefix(prefix: string): Promise<number> {
    let deleted = 0;
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
        deleted++;
      }
    }
    return deleted;
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  cleanup(): number {
    let removed = 0;
    const now = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        removed++;
      }
    }

    return removed;
  }
}

class RedisCache implements ICache {
  private client: Redis;
  private defaultTTL: number;
  private keyPrefix: string;

  constructor(
    redisUrl: string,
    defaultTTLSeconds: number = DEFAULT_CACHE_TTL,
    keyPrefix: string = REDIS_KEY_PREFIX
  ) {
    this.client = new Redis(redisUrl);
    this.defaultTTL = defaultTTLSeconds;
    this.keyPrefix = keyPrefix;

    this.client.on("connect", () => {
      console.log("[Redis] Connected successfully");
    });

    this.client.on("error", (err) => {
      console.error("[Redis] Connection error:", err.message);
    });
  }

  private prefixKey(key: string): string {
    return `${this.keyPrefix}${key}`;
  }

  async get<T>(key: string): Promise<T | undefined> {
    try {
      const data = await this.client.get(this.prefixKey(key));
      if (!data) {
        return undefined;
      }
      return JSON.parse(data) as T;
    } catch (error) {
      console.error("[Redis] Error getting key:", key, error);
      return undefined;
    }
  }

  async set<T>(key: string, data: T, ttlSeconds?: number): Promise<void> {
    try {
      const ttl = ttlSeconds ?? this.defaultTTL;
      await this.client.setex(
        this.prefixKey(key),
        ttl,
        JSON.stringify(data)
      );
    } catch (error) {
      console.error("[Redis] Error setting key:", key, error);
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      const result = await this.client.del(this.prefixKey(key));
      return result > 0;
    } catch (error) {
      console.error("[Redis] Error deleting key:", key, error);
      return false;
    }
  }

  async deleteByPrefix(prefix: string): Promise<number> {
    try {
      const pattern = this.prefixKey(`${prefix}*`);
      const keys = await this.client.keys(pattern);
      if (keys.length === 0) {
        return 0;
      }
      return await this.client.del(...keys);
    } catch (error) {
      console.error("[Redis] Error deleting by prefix:", prefix, error);
      return 0;
    }
  }

  async clear(): Promise<void> {
    try {
      const pattern = this.prefixKey("*");
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
    } catch (error) {
      console.error("[Redis] Error clearing cache:", error);
    }
  }

  async disconnect(): Promise<void> {
    await this.client.quit();
  }
}

const createCache = (): ICache => {
  const redisUrl = process.env.REDIS_URL;

  if (redisUrl) {
    console.log("[Cache] Using Redis cache");
    return new RedisCache(redisUrl);
  }

  console.log("[Cache] Using in-memory cache (set REDIS_URL for Redis)");
  return new MemoryCache();
};

export const cache = createCache();

export { ICache, MemoryCache, RedisCache };
export default MemoryCache;
