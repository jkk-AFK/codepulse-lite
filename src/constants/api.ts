/**
 * API相关常量
 */

export const API_CONSTANTS = {
  // 请求超时时间(毫秒)
  REQUEST_TIMEOUT: 30000,
  
  // 重试次数
  MAX_RETRIES: 3,
  
  // 重试延迟(毫秒)
  RETRY_DELAY: 1000,
  
  // API限流阈值
  RATE_LIMIT_THRESHOLD: 10,
  
  // 每页数据量
  PER_PAGE: {
    COMMITS: 100,
    CONTRIBUTORS: 30,
    ISSUES: 100,
    PULL_REQUESTS: 100,
  },
} as const;

export default API_CONSTANTS;
