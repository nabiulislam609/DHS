/**
 * High-Performance In-Memory Redis Caching Module
 * Provides Redis-compatible semantics (GET, SET with TTL, DEL, FLUSH)
 * and detailed metrics for high-traffic endpoints (such as result processing).
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number | null; // null means no expiration
  createdAt: number;
}

export interface RedisStats {
  hits: number;
  misses: number;
  totalRequests: number;
  hitRatio: number;
  keysCount: number;
  memoryUsageBytes: number;
  lastUpdated: string;
}

class RedisCache {
  private store: Map<string, CacheEntry<any>> = new Map();
  private hits: number = 0;
  private misses: number = 0;
  private defaultTTL: number = 300; // 5 minutes default

  constructor(defaultTTLSeconds: number = 300) {
    this.defaultTTL = defaultTTLSeconds;
    // Auto purge expired entries every 30 seconds
    setInterval(() => this.purgeExpired(), 30000);
  }

  /**
   * Get value from cache. Checks TTL expiration.
   */
  public get<T>(key: string): { data: T | null; hit: boolean; latencyMs: number } {
    const start = performance.now();
    const entry = this.store.get(key);

    if (!entry) {
      this.misses++;
      const latencyMs = Number((performance.now() - start).toFixed(2));
      return { data: null, hit: false, latencyMs };
    }

    // Check expiration
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      this.misses++;
      const latencyMs = Number((performance.now() - start).toFixed(2));
      return { data: null, hit: false, latencyMs };
    }

    this.hits++;
    const latencyMs = Number((performance.now() - start).toFixed(2));
    return { data: entry.value as T, hit: true, latencyMs };
  }

  /**
   * Set value in cache with optional TTL in seconds
   */
  public set<T>(key: string, value: T, ttlSeconds?: number): void {
    const ttl = ttlSeconds !== undefined ? ttlSeconds : this.defaultTTL;
    const expiresAt = ttl > 0 ? Date.now() + ttl * 1000 : null;
    this.store.set(key, {
      value,
      expiresAt,
      createdAt: Date.now(),
    });
  }

  /**
   * Delete a key or keys matching prefix pattern
   */
  public del(keyOrPrefix: string): number {
    let deletedCount = 0;
    if (keyOrPrefix.endsWith('*')) {
      const prefix = keyOrPrefix.slice(0, -1);
      for (const key of this.store.keys()) {
        if (key.startsWith(prefix)) {
          this.store.delete(key);
          deletedCount++;
        }
      }
    } else {
      if (this.store.delete(keyOrPrefix)) {
        deletedCount = 1;
      }
    }
    return deletedCount;
  }

  /**
   * Clear entire cache
   */
  public flush(): void {
    this.store.clear();
  }

  /**
   * Return cache metrics
   */
  public getStats(): RedisStats {
    const totalRequests = this.hits + this.misses;
    const hitRatio = totalRequests > 0 ? Number(((this.hits / totalRequests) * 100).toFixed(1)) : 0;
    
    // Estimate memory usage
    let approxBytes = 0;
    for (const [k, v] of this.store.entries()) {
      approxBytes += (k.length + JSON.stringify(v.value).length) * 2;
    }

    return {
      hits: this.hits,
      misses: this.misses,
      totalRequests,
      hitRatio,
      keysCount: this.store.size,
      memoryUsageBytes: approxBytes,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Inspect all active keys
   */
  public getKeys(): Array<{ key: string; ttlRemainingSec: number | null }> {
    const now = Date.now();
    const result: Array<{ key: string; ttlRemainingSec: number | null }> = [];
    for (const [key, entry] of this.store.entries()) {
      if (entry.expiresAt && now > entry.expiresAt) {
        continue;
      }
      const ttlRemainingSec = entry.expiresAt ? Math.max(0, Math.round((entry.expiresAt - now) / 1000)) : null;
      result.push({ key, ttlRemainingSec });
    }
    return result;
  }

  private purgeExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (entry.expiresAt && now > entry.expiresAt) {
        this.store.delete(key);
      }
    }
  }
}

const ttlFromEnv = Number(process.env.REDIS_CACHE_TTL) || 300;
export const redisCache = new RedisCache(ttlFromEnv);
