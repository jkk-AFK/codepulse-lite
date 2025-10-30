/**
 * 应用配置
 * 集中管理环境变量和应用配置
 */

export const config = {
  // GitHub API配置
  github: {
    token: import.meta.env.VITE_GITHUB_TOKEN || '',
    apiUrl: 'https://api.github.com',
  },
  
  // 缓存配置
  cache: {
    enabled: true,
    duration: 30 * 60 * 1000, // 30分钟
    maxEntries: 20, // 最多缓存20条记录
  },
  
  // 应用信息
  app: {
    name: 'CodePulse Lite',
    version: '1.0.0',
    description: 'GitHub仓库健康度分析工具',
  },
} as const;

export default config;
