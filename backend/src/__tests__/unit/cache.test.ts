import { MemoryCache } from '../../utils/cache';

describe('MemoryCache', () => {
  let cache: MemoryCache;

  beforeEach(() => {
    cache = new MemoryCache(1); // 1 second TTL for faster tests
  });

  describe('set and get', () => {
    it('should store and retrieve a value', async () => {
      await cache.set('key1', { name: 'test' });
      const result = await cache.get<{ name: string }>('key1');
      expect(result).toEqual({ name: 'test' });
    });

    it('should return undefined for non-existent key', async () => {
      const result = await cache.get('non-existent');
      expect(result).toBeUndefined();
    });

    it('should store different data types', async () => {
      await cache.set('string', 'hello');
      await cache.set('number', 42);
      await cache.set('array', [1, 2, 3]);
      await cache.set('object', { a: 1, b: 2 });

      expect(await cache.get('string')).toBe('hello');
      expect(await cache.get('number')).toBe(42);
      expect(await cache.get('array')).toEqual([1, 2, 3]);
      expect(await cache.get('object')).toEqual({ a: 1, b: 2 });
    });

    it('should overwrite existing value', async () => {
      await cache.set('key', 'value1');
      await cache.set('key', 'value2');
      expect(await cache.get('key')).toBe('value2');
    });
  });

  describe('TTL expiration', () => {
    it('should expire entries after TTL', async () => {
      await cache.set('expiring', 'value', 0.1); // 100ms TTL
      
      // Value should exist immediately
      expect(await cache.get('expiring')).toBe('value');
      
      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Value should be expired
      expect(await cache.get('expiring')).toBeUndefined();
    });

    it('should use custom TTL when provided', async () => {
      await cache.set('custom-ttl', 'value', 2); // 2 seconds
      
      // Wait 1.5 seconds (less than TTL)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Value should still exist
      expect(await cache.get('custom-ttl')).toBe('value');
    });
  });

  describe('delete', () => {
    it('should delete an existing key', async () => {
      await cache.set('to-delete', 'value');
      const deleted = await cache.delete('to-delete');
      
      expect(deleted).toBe(true);
      expect(await cache.get('to-delete')).toBeUndefined();
    });

    it('should return false when deleting non-existent key', async () => {
      const deleted = await cache.delete('non-existent');
      expect(deleted).toBe(false);
    });
  });

  describe('deleteByPrefix', () => {
    it('should delete all keys matching prefix', async () => {
      await cache.set('catalog:loc1', 'data1');
      await cache.set('catalog:loc2', 'data2');
      await cache.set('locations', 'data3');
      
      const deleted = await cache.deleteByPrefix('catalog:');
      
      expect(deleted).toBe(2);
      expect(await cache.get('catalog:loc1')).toBeUndefined();
      expect(await cache.get('catalog:loc2')).toBeUndefined();
      expect(await cache.get('locations')).toBe('data3');
    });

    it('should return 0 when no keys match prefix', async () => {
      await cache.set('key1', 'value1');
      const deleted = await cache.deleteByPrefix('nonexistent:');
      expect(deleted).toBe(0);
    });
  });

  describe('clear', () => {
    it('should remove all entries', async () => {
      await cache.set('key1', 'value1');
      await cache.set('key2', 'value2');
      await cache.set('key3', 'value3');
      
      await cache.clear();
      
      expect(cache.size()).toBe(0);
      expect(await cache.get('key1')).toBeUndefined();
      expect(await cache.get('key2')).toBeUndefined();
      expect(await cache.get('key3')).toBeUndefined();
    });
  });

  describe('size', () => {
    it('should return the number of entries', async () => {
      expect(cache.size()).toBe(0);
      
      await cache.set('key1', 'value1');
      expect(cache.size()).toBe(1);
      
      await cache.set('key2', 'value2');
      expect(cache.size()).toBe(2);
    });
  });

  describe('cleanup', () => {
    it('should remove expired entries', async () => {
      await cache.set('expired1', 'value', 0.05); // 50ms
      await cache.set('expired2', 'value', 0.05); // 50ms
      await cache.set('valid', 'value', 10); // 10 seconds
      
      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const removed = cache.cleanup();
      
      expect(removed).toBe(2);
      expect(cache.size()).toBe(1);
      expect(await cache.get('valid')).toBe('value');
    });
  });
});
