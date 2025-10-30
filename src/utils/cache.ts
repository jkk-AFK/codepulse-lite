/**
 * 缓存服务
 * 提供统一的缓存管理功能，基于LocalStorage实现
 */

import { CACHE_CONSTANTS } from '../constants/cache';

/**
 * 缓存条目接口
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

/**
 * 缓存服务类
 */
export class CacheService {
  private readonly prefix: string;
  private readonly defaultDuration: number;

  constructor(prefix: string = CACHE_CONSTANTS.PREFIX, duration?: number) {
    this.prefix = prefix;
    this.defaultDuration = duration || CACHE_CONSTANTS.DURATION.REPO_ANALYSIS;
  }

  /**
   * 生成完整的缓存键
   */
  private getFullKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * 检查缓存是否过期
   */
  private isExpired<T>(entry: CacheEntry<T>): boolean {
    return Date.now() > entry.expiresAt;
  }

  /**
   * 获取缓存数据
   * @param key 缓存键
   * @returns 缓存的数据，如果不存在或已过期则返回null
   */
  get<T>(key: string): T | null {
    try {
      const fullKey = this.getFullKey(key);
      const cached = localStorage.getItem(fullKey);

      if (!cached) {
        return null;
      }

      const entry: CacheEntry<T> = JSON.parse(cached);

      // 检查是否过期
      if (this.isExpired(entry)) {
        this.remove(key);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.error('获取缓存失败:', error);
      return null;
    }
  }

  /**
   * 设置缓存数据
   * @param key 缓存键
   * @param data 要缓存的数据
   * @param duration 可选的过期时间(毫秒)，默认使用构造函数中的配置
   */
  set<T>(key: string, data: T, duration?: number): void {
    try {
      const fullKey = this.getFullKey(key);
      const expiresIn = duration || this.defaultDuration;
      const timestamp = Date.now();

      const entry: CacheEntry<T> = {
        data,
        timestamp,
        expiresAt: timestamp + expiresIn,
      };

      localStorage.setItem(fullKey, JSON.stringify(entry));
    } catch (error) {
      console.error('设置缓存失败:', error);
      // LocalStorage可能已满，尝试清理旧缓存
      this.cleanExpired();
      
      // 重试一次
      try {
        const fullKey = this.getFullKey(key);
        const expiresIn = duration || this.defaultDuration;
        const timestamp = Date.now();
        const entry: CacheEntry<T> = {
          data,
          timestamp,
          expiresAt: timestamp + expiresIn,
        };
        localStorage.setItem(fullKey, JSON.stringify(entry));
      } catch (retryError) {
        console.error('重试设置缓存失败:', retryError);
      }
    }
  }

  /**
   * 删除指定的缓存
   * @param key 缓存键
   */
  remove(key: string): void {
    try {
      const fullKey = this.getFullKey(key);
      localStorage.removeItem(fullKey);
    } catch (error) {
      console.error('删除缓存失败:', error);
    }
  }

  /**
   * 清除所有缓存或指定前缀的缓存
   * @param key 可选的缓存键，不传则清除所有该服务的缓存
   */
  clear(key?: string): void {
    try {
      if (key) {
        this.remove(key);
      } else {
        // 清除所有带有当前前缀的缓存
        const keysToRemove: string[] = [];
        
        for (let i = 0; i < localStorage.length; i++) {
          const storageKey = localStorage.key(i);
          if (storageKey && storageKey.startsWith(this.prefix)) {
            keysToRemove.push(storageKey);
          }
        }

        keysToRemove.forEach(fullKey => localStorage.removeItem(fullKey));
      }
    } catch (error) {
      console.error('清除缓存失败:', error);
    }
  }

  /**
   * 清理所有已过期的缓存
   */
  cleanExpired(): void {
    try {
      const keysToRemove: string[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const storageKey = localStorage.key(i);
        
        if (storageKey && storageKey.startsWith(this.prefix)) {
          const cached = localStorage.getItem(storageKey);
          
          if (cached) {
            try {
              const entry: CacheEntry<unknown> = JSON.parse(cached);
              if (this.isExpired(entry)) {
                keysToRemove.push(storageKey);
              }
            } catch {
              // JSON解析失败，删除该缓存
              keysToRemove.push(storageKey);
            }
          }
        }
      }

      keysToRemove.forEach(fullKey => localStorage.removeItem(fullKey));
    } catch (error) {
      console.error('清理过期缓存失败:', error);
    }
  }

  /**
   * 获取缓存的剩余时间(毫秒)
   * @param key 缓存键
   * @returns 剩余时间(毫秒)，如果不存在或已过期则返回0
   */
  getTimeToLive(key: string): number {
    try {
      const fullKey = this.getFullKey(key);
      const cached = localStorage.getItem(fullKey);

      if (!cached) {
        return 0;
      }

      const entry: CacheEntry<unknown> = JSON.parse(cached);
      const ttl = entry.expiresAt - Date.now();

      return ttl > 0 ? ttl : 0;
    } catch (error) {
      console.error('获取缓存TTL失败:', error);
      return 0;
    }
  }

  /**
   * 检查缓存是否存在且未过期
   * @param key 缓存键
   * @returns 是否存在有效缓存
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }
}

// 导出默认实例
export const cacheService = new CacheService();

export default cacheService;
