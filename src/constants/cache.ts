/**
 * 缓存相关常量
 */

export const CACHE_CONSTANTS = {
  // 缓存键前缀
  PREFIX: 'codepulse_',
  
  // 缓存键名
  KEYS: {
    REPO_ANALYSIS: 'repo_analysis',
    SEARCH_RESULTS: 'search_results',
    HISTORY: 'analysis_history',
  },
  
  // 缓存过期时间(毫秒)
  DURATION: {
    REPO_ANALYSIS: 30 * 60 * 1000, // 30分钟
    SEARCH_RESULTS: 5 * 60 * 1000,  // 5分钟
    HISTORY: 7 * 24 * 60 * 60 * 1000, // 7天
  },
  
  // 最大缓存条目数
  MAX_ENTRIES: {
    ANALYSIS: 20,
    SEARCH: 10,
    HISTORY: 50,
  },
} as const;

export default CACHE_CONSTANTS;
