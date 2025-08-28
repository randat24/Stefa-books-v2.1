import { logger } from './logger';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class APICache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL: number;

  constructor(defaultTTL = 5 * 60 * 1000) { // 5 minutes default
    this.defaultTTL = defaultTTL;
    
    // Clean expired entries every minute
    setInterval(() => this.cleanup(), 60 * 1000);
  }

  /**
   * Get data from cache if it exists and is not expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      logger.debug(`Cache miss for key: ${key}`, undefined, 'Cache');
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      logger.debug(`Cache expired for key: ${key}`, undefined, 'Cache');
      this.cache.delete(key);
      return null;
    }

    logger.debug(`Cache hit for key: ${key}`, undefined, 'Cache');
    return entry.data;
  }

  /**
   * Store data in cache with optional TTL
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const actualTTL = ttl || this.defaultTTL;
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + actualTTL
    };

    this.cache.set(key, entry);
    logger.debug(`Cache set for key: ${key}, TTL: ${actualTTL}ms`, undefined, 'Cache');
  }

  /**
   * Delete a specific key from cache
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      logger.debug(`Cache deleted for key: ${key}`, undefined, 'Cache');
    }
    return deleted;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    logger.debug('Cache cleared', undefined, 'Cache');
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    let deletedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        deletedCount++;
      }
    }

    if (deletedCount > 0) {
      logger.debug(`Cache cleanup: removed ${deletedCount} expired entries`, undefined, 'Cache');
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }

  /**
   * Generate cache key from filters
   */
  static createKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        if (params[key] !== undefined && params[key] !== null) {
          acc[key] = params[key];
        }
        return acc;
      }, {} as Record<string, any>);

    return `${prefix}:${JSON.stringify(sortedParams)}`;
  }
}

// Different cache instances for different data types
export const booksCache = new APICache(10 * 60 * 1000); // 10 minutes for books
export const categoriesCache = new APICache(30 * 60 * 1000); // 30 minutes for categories
export const searchCache = new APICache(5 * 60 * 1000); // 5 minutes for search results

// Generic cache for other API calls
export const apiCache = new APICache();

export { APICache };