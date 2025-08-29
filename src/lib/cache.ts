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
      console.log(`❌ Cache miss for key: ${key}`)
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      console.log(`⏰ Cache expired for key: ${key}`)
      this.cache.delete(key);
      return null;
    }

    console.log(`✅ Cache hit for key: ${key}`)
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
    console.log(`💾 Cache set for key: ${key}, TTL: ${actualTTL}ms`)
  }

  /**
   * Delete a specific key from cache
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      console.log(`🗑️ Cache deleted key: ${key}`);
    }
    return deleted;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    const size = this.cache.size;
    this.cache.clear();
    console.log(`🗑️ Cache cleared: removed ${size} entries`);
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
      console.log(`🧹 Cache cleanup: removed ${deletedCount} expired entries`);
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const stats = {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
    console.log('📊 Cache stats:', stats);
    return stats;
  }

  /**
   * Create a cache key from filters
   */
  createKey(prefix: string, filters: Record<string, any> = {}): string {
    const sortedKeys = Object.keys(filters).sort();
    const keyParts = [prefix, ...sortedKeys.map(key => `${key}:${filters[key]}`)];
    const cacheKey = keyParts.join('|');
    console.log(`🔑 Created cache key: ${cacheKey} from filters:`, filters)
    return cacheKey;
  }
}

// Different cache instances for different data types
export const booksCache = new APICache(10 * 60 * 1000); // 10 minutes for books
export const categoriesCache = new APICache(30 * 60 * 1000); // 30 minutes for categories
export const searchCache = new APICache(5 * 60 * 1000); // 5 minutes for search results

// Generic cache for other API calls
export const apiCache = new APICache();

export { APICache };