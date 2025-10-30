/**
 * API 限流状态显示组件
 * 实时显示 GitHub API 的速率限制状态
 */

import { Activity, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { githubService } from '../services/github';
import type { RateLimit } from '../types';

export default function RateLimitStatus() {
  const [rateLimit, setRateLimit] = useState<RateLimit | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRateLimit = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await githubService.getRateLimit();
      
      // 验证数据有效性
      if (!data || data.limit === 0) {
        console.warn('Invalid rate limit data received:', data);
        setError('API 返回数据异常');
        return;
      }
      
      setRateLimit(data);
    } catch (err) {
      setError('获取限流信息失败');
      console.error('Failed to fetch rate limit:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRateLimit();
    // 每分钟刷新一次
    const interval = setInterval(fetchRateLimit, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !rateLimit) {
    return (
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Activity className="w-4 h-4 animate-pulse" />
          <span>加载中...</span>
        </div>
      </div>
    );
  }

  if (error && !rateLimit) {
    return (
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 text-sm text-red-400">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!rateLimit) return null;

  // 如果 limit 为 0，说明 API 调用失败
  if (rateLimit.limit === 0) {
    return (
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 text-sm text-yellow-400">
          <AlertCircle className="w-4 h-4" />
          <div>
            <div className="font-medium">API 状态异常</div>
            <div className="text-xs text-gray-400 mt-1">
              无法获取限流信息，请检查网络连接
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const percentage = (rateLimit.remaining / rateLimit.limit) * 100;
  const isLow = percentage < 20;
  const resetDate = new Date(rateLimit.reset * 1000);
  const now = new Date();
  const minutesUntilReset = Math.ceil((resetDate.getTime() - now.getTime()) / 60000);

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Activity className={`w-4 h-4 ${isLow ? 'text-red-400' : 'text-cyan-400'}`} />
          <span className="text-sm font-medium">API 限流状态</span>
        </div>
        <button
          onClick={fetchRateLimit}
          className="text-xs text-gray-400 hover:text-cyan-400 transition-colors"
          disabled={loading}
        >
          刷新
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">剩余请求</span>
          <span className={isLow ? 'text-red-400 font-semibold' : 'text-cyan-400'}>
            {rateLimit.remaining} / {rateLimit.limit}
          </span>
        </div>

        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isLow ? 'bg-red-400' : 'bg-cyan-400'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* 未配置 Token 提示 */}
        {rateLimit.limit === 60 && (
          <div className="flex items-center gap-1 text-xs text-yellow-400 bg-yellow-400/10 rounded p-2">
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            <span>
              未认证（60次/小时）·配置 Token 可提升至 5000次/小时
            </span>
          </div>
        )}

        {isLow && (
          <div className="flex items-center gap-1 text-xs text-red-400">
            <AlertCircle className="w-3 h-3" />
            <span>
              限流即将耗尽，{minutesUntilReset} 分钟后重置
            </span>
          </div>
        )}

        {!isLow && minutesUntilReset < 60 && minutesUntilReset > 0 && (
          <div className="text-xs text-gray-400">
            {minutesUntilReset} 分钟后重置
          </div>
        )}
      </div>
    </div>
  );
}
