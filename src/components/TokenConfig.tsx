/**
 * Token 配置组件
 * 允许用户在应用内直接配置 GitHub Token
 */

import { Key, Save, X, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';

interface TokenConfigProps {
  onTokenChange?: () => void;
}

export default function TokenConfig({ onTokenChange }: TokenConfigProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // 从 localStorage 读取已保存的 token
    const savedToken = localStorage.getItem('github_token') || '';
    setToken(savedToken);
  }, []);

  const handleSave = () => {
    if (token.trim()) {
      // 验证 token 格式（应该以 ghp_ 或 github_pat_ 开头）
      if (!token.startsWith('ghp_') && !token.startsWith('github_pat_')) {
        alert('Token 格式可能不正确。GitHub Token 通常以 ghp_ 或 github_pat_ 开头');
        return;
      }
      
      localStorage.setItem('github_token', token.trim());
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setIsOpen(false);
        // 通知父组件 token 已更改
        onTokenChange?.();
        // 刷新页面以应用新 token
        window.location.reload();
      }, 1500);
    } else {
      // 清除 token
      localStorage.removeItem('github_token');
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setIsOpen(false);
        onTokenChange?.();
        window.location.reload();
      }, 1500);
    }
  };

  const hasToken = !!localStorage.getItem('github_token');

  return (
    <>
      {/* 触发按钮 */}
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
          hasToken
            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
            : 'bg-white/10 text-gray-400 hover:bg-white/20'
        }`}
        title={hasToken ? 'Token 已配置' : '配置 GitHub Token'}
      >
        <Key className="w-4 h-4" />
        <span className="text-sm hidden sm:inline">
          {hasToken ? 'Token 已配置' : '配置 Token'}
        </span>
      </button>

      {/* 配置弹窗 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 max-w-2xl w-full animate-in fade-in duration-300">
            {/* 标题栏 */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-semibold">配置 GitHub Token</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 说明 */}
            <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-sm text-gray-300 mb-2">
                <strong className="text-blue-400">为什么需要配置 Token？</strong>
              </p>
              <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
                <li>未配置：60 次请求/小时（约 20 个仓库）</li>
                <li>已配置：5000 次请求/小时（约 1666 个仓库）</li>
                <li>Token 仅保存在浏览器本地，不会上传到服务器</li>
                <li>无需任何权限，使用默认的公开访问权限即可</li>
              </ul>
            </div>

            {/* Token 输入 */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                GitHub Personal Access Token
              </label>
              <div className="relative">
                <input
                  type={showToken ? 'text' : 'password'}
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-lg 
                           focus:outline-none focus:border-cyan-400 transition-colors
                           font-mono text-sm"
                />
                <button
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 
                           rounded transition-colors"
                  type="button"
                >
                  {showToken ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Token 以 ghp_ 或 github_pat_ 开头
              </p>
            </div>

            {/* 获取 Token 步骤 */}
            <div className="mb-6 p-4 bg-white/5 rounded-lg">
              <p className="text-sm font-medium mb-2 text-gray-300">
                🔑 如何获取 Token？
              </p>
              <ol className="text-sm text-gray-400 space-y-2 list-decimal list-inside">
                <li>
                  访问{' '}
                  <a
                    href="https://github.com/settings/tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 underline"
                  >
                    GitHub Settings → Tokens
                  </a>
                </li>
                <li>点击 "Generate new token" → "Generate new token (classic)"</li>
                <li>设置 Token 名称（如：codepulse-lite）</li>
                <li>
                  <strong className="text-yellow-400">无需选择任何权限</strong>
                  （保持默认即可）
                </li>
                <li>点击底部 "Generate token" 生成</li>
                <li>立即复制 Token（只显示一次！）</li>
              </ol>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saved}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 
                         bg-cyan-500 hover:bg-cyan-600 disabled:bg-green-500 
                         text-white rounded-lg transition-colors font-medium"
              >
                {saved ? (
                  <>
                    <span>✓</span>
                    <span>已保存</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{token ? '保存 Token' : '清除 Token'}</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg 
                         transition-colors font-medium"
              >
                取消
              </button>
            </div>

            {/* 提示 */}
            <p className="text-xs text-gray-500 mt-4 text-center">
              Token 将保存在浏览器本地存储中，清除浏览器数据会同时清除 Token
            </p>
          </div>
        </div>
      )}
    </>
  );
}
