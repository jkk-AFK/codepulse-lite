import { Search, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
  onSearch: (owner: string, repo: string) => void;
  loading: boolean;
}

export default function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 解析输入
    // 支持格式: owner/repo 或 https://github.com/owner/repo
    let owner = '';
    let repo = '';

    const urlPattern = /github\.com\/([^/]+)\/([^/?#]+)/;
    const simplePattern = /^([^/]+)\/([^/]+)$/;

    const urlMatch = input.match(urlPattern);
    const simpleMatch = input.match(simplePattern);

    if (urlMatch) {
      owner = urlMatch[1];
      repo = urlMatch[2];
    } else if (simpleMatch) {
      owner = simpleMatch[1];
      repo = simpleMatch[2];
    } else {
      setError('请输入正确的仓库格式：owner/repo 或 GitHub URL');
      return;
    }

    if (owner && repo) {
      onSearch(owner, repo);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="glass-card p-2">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-gray-400 ml-3" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入 GitHub 仓库地址 (例如: facebook/react 或 https://github.com/facebook/react)"
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-500 py-3"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  分析中...
                </>
              ) : (
                '开始分析'
              )}
            </button>
          </div>
        </div>
        {error && (
          <div className="absolute top-full mt-2 w-full">
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          </div>
        )}
      </form>

      {/* 快速示例 */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        <span className="text-sm text-gray-400">试试这些热门项目：</span>
        {['microsoft/vscode', 'facebook/react', 'vercel/next.js', 'vuejs/vue'].map((example) => (
          <button
            key={example}
            onClick={() => {
              setInput(example);
              const [owner, repo] = example.split('/');
              onSearch(owner, repo);
            }}
            disabled={loading}
            className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors disabled:opacity-50"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}
