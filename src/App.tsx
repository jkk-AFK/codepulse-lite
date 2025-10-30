import { useState } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import AnalysisReport from './components/AnalysisReport';
import HistoryPanel from './components/HistoryPanel';
import ThemeToggle from './components/ThemeToggle';
import RateLimitStatus from './components/RateLimitStatus';
import ComparePanel from './components/ComparePanel';
import TokenConfig from './components/TokenConfig';
import { githubService } from './services/github';
import type { AnalysisResult } from './types';
import { AlertCircle, Sparkles, RefreshCw } from 'lucide-react';
import { ErrorHandler, APIError, ErrorType } from './utils/error';
import { CACHE_CONSTANTS } from './constants/cache';

function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<APIError | null>(null);
  const [refreshHistory, setRefreshHistory] = useState(0);

  const handleSearch = async (owner: string, repo: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysis = await githubService.analyzeRepository(owner, repo);
      setResult(analysis);
      
      // 保存到本地存储
      try {
        const history = JSON.parse(localStorage.getItem(CACHE_CONSTANTS.KEYS.HISTORY) || '[]');
        history.unshift({
          id: `${owner}/${repo}-${Date.now()}`,
          repoFullName: `${owner}/${repo}`,
          result: analysis,
          timestamp: Date.now(),
        });
        // 只保留最近配置的记录数
        localStorage.setItem(
          CACHE_CONSTANTS.KEYS.HISTORY, 
          JSON.stringify(history.slice(0, CACHE_CONSTANTS.MAX_ENTRIES.HISTORY))
        );
        setRefreshHistory(prev => prev + 1);
      } catch (storageError) {
        // 存储失败不影响主流程
        console.warn('保存历史记录失败:', storageError);
      }
    } catch (err: unknown) {
      const apiError = ErrorHandler.handle(err);
      setError(apiError);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (error) {
      setError(null);
    }
  };

  const handleClearHistory = () => {
    localStorage.removeItem(CACHE_CONSTANTS.KEYS.HISTORY);
    setRefreshHistory(prev => prev + 1);
  };

  const handleSelectFromHistory = (owner: string, repo: string) => {
    handleSearch(owner, repo);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* 顶部工具栏 */}
        <div className="flex justify-end gap-3 mb-6">
          <TokenConfig onTokenChange={() => setRefreshHistory(prev => prev + 1)} />
          <ThemeToggle />
          <RateLimitStatus />
        </div>

        {/* Hero Section */}
        {!result && (
          <div className="text-center mb-12 animate-in fade-in duration-700">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-cyan-400" />
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                智能分析 GitHub 仓库健康度
              </h2>
            </div>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              全方位评估代码质量、文档完整性、社区活跃度等多个维度，
              <br />
              为你的项目提供专业的健康度报告
            </p>
          </div>
        )}

        {/* 搜索栏 */}
        <div className="mb-12">
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>

        {/* 历史记录和比较面板 */}
        {!result && !loading && (
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <HistoryPanel 
              key={refreshHistory}
              onSelect={handleSelectFromHistory}
              onClear={handleClearHistory}
              onToggleFavorite={() => setRefreshHistory(prev => prev + 1)}
            />
            <ComparePanel key={refreshHistory} />
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <div className="max-w-3xl mx-auto mb-8 animate-in fade-in duration-300">
            <div className={`glass-card p-6 border-l-4 ${
              error.type === ErrorType.RATE_LIMIT ? 'border-yellow-500' : 'border-red-500'
            }`}>
              <div className="flex items-start gap-3">
                <AlertCircle className={`w-6 h-6 flex-shrink-0 mt-0.5 ${
                  error.type === ErrorType.RATE_LIMIT ? 'text-yellow-400' : 'text-red-400'
                }`} />
                <div className="flex-1">
                  <h3 className={`font-semibold mb-2 ${
                    error.type === ErrorType.RATE_LIMIT ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {error.getTitle()}
                  </h3>
                  <p className="text-sm text-gray-300 mb-4">{error.userMessage}</p>
                  
                  {/* 特殊处理限流错误 */}
                  {error.type === ErrorType.RATE_LIMIT && (
                    <div className="text-sm text-gray-400 bg-white/5 rounded-lg p-4 mb-4">
                      <p className="mb-2">💡 <strong>解决方案：</strong></p>
                      <ol className="list-decimal list-inside space-y-1 ml-2">
                        <li>配置 GitHub Personal Access Token 以提高限额</li>
                        <li>等待限流重置后再试（通常为1小时）</li>
                        <li>查看 .env.example 文件了解配置方法</li>
                      </ol>
                    </div>
                  )}

                  {/* 操作按钮 */}
                  {ErrorHandler.shouldRetry(error) && (
                    <button
                      onClick={handleRetry}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 
                                 text-cyan-400 rounded-lg transition-colors text-sm font-medium"
                    >
                      <RefreshCw className="w-4 h-4" />
                      {error.getAction()}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 分析结果 */}
        {result && (
          <div className="max-w-7xl mx-auto">
            <AnalysisReport result={result} />
          </div>
        )}

        {/* 功能介绍 */}
        {!result && !loading && (
          <div className="max-w-6xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">多维度评分</h3>
              <p className="text-sm text-gray-400">
                综合评估代码质量、文档、活跃度、社区参与、维护质量等5大维度
              </p>
            </div>

            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">可视化报告</h3>
              <p className="text-sm text-gray-400">
                直观的图表展示提交历史、贡献者分布、Issues和PR状态等关键数据
              </p>
            </div>

            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">即时分析</h3>
              <p className="text-sm text-gray-400">
                无需注册登录，输入仓库地址即可获得详细的健康度分析报告
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-400">
          <p>
            Powered by GitHub API | Made with ❤️ by{' '}
            <a href="https://github.com/jkk-AFK" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              @jkk-AFK
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
