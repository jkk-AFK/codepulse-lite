/**
 * 仓库比较组件
 * 支持多个仓库的健康度对比
 */

import { GitCompare, X } from 'lucide-react';
import { useState } from 'react';
import type { StoredAnalysis } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ComparePanel() {
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  const history = JSON.parse(localStorage.getItem('analysis_history') || '[]') as StoredAnalysis[];

  const handleToggleRepo = (repoFullName: string) => {
    setSelectedRepos(prev => {
      if (prev.includes(repoFullName)) {
        return prev.filter(r => r !== repoFullName);
      }
      if (prev.length >= 5) {
        alert('最多只能比较 5 个仓库');
        return prev;
      }
      return [...prev, repoFullName];
    });
  };

  const comparisonData = selectedRepos
    .map(repoFullName => {
      const analysis = history.find(h => h.repoFullName === repoFullName);
      if (!analysis) return null;

      return {
        name: repoFullName.split('/')[1], // 只显示仓库名
        fullName: repoFullName,
        overall: analysis.result.healthScore.overall,
        codeQuality: analysis.result.healthScore.codeQuality,
        documentation: analysis.result.healthScore.documentation,
        activity: analysis.result.healthScore.activity,
        community: analysis.result.healthScore.community,
        maintenance: analysis.result.healthScore.maintenance,
        stars: analysis.result.repo.stargazers_count,
        forks: analysis.result.repo.forks_count,
        contributors: analysis.result.contributors.length,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  if (history.length === 0) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <GitCompare className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold">仓库比较</h3>
        </div>
        <p className="text-gray-400 text-sm text-center py-8">
          需要至少两个分析记录才能使用比较功能
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GitCompare className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold">仓库比较</h3>
          <span className="text-sm text-gray-400">
            ({selectedRepos.length}/5)
          </span>
        </div>
        {selectedRepos.length > 0 && (
          <button
            onClick={() => setSelectedRepos([])}
            className="text-sm text-gray-400 hover:text-red-400 transition-colors"
          >
            清除选择
          </button>
        )}
      </div>

      {/* 仓库选择列表 */}
      <div className="mb-6 space-y-2 max-h-40 overflow-y-auto">
        {history.slice(0, 20).map(item => {
          const isSelected = selectedRepos.includes(item.repoFullName);
          const score = item.result.healthScore.overall;
          const scoreColor = score >= 80 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400';

          return (
            <button
              key={item.id}
              onClick={() => handleToggleRepo(item.repoFullName)}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                isSelected
                  ? 'bg-cyan-500/20 border border-cyan-500/50'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    isSelected ? 'bg-cyan-500 border-cyan-500' : 'border-gray-500'
                  }`}
                >
                  {isSelected && <span className="text-white text-xs">✓</span>}
                </div>
                <span className="text-sm">{item.repoFullName}</span>
              </div>
              <span className={`text-sm font-semibold ${scoreColor}`}>
                {score}分
              </span>
            </button>
          );
        })}
      </div>

      {/* 比较图表 */}
      {comparisonData.length >= 2 && (
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-3 text-gray-300">健康度评分对比</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis 
                  dataKey="name" 
                  stroke="#888" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#888" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="overall" fill="#06b6d4" name="总分" />
                <Bar dataKey="codeQuality" fill="#8b5cf6" name="代码质量" />
                <Bar dataKey="documentation" fill="#ec4899" name="文档" />
                <Bar dataKey="activity" fill="#f59e0b" name="活跃度" />
                <Bar dataKey="community" fill="#10b981" name="社区" />
                <Bar dataKey="maintenance" fill="#3b82f6" name="维护" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 数据表格 */}
          <div>
            <h4 className="text-sm font-medium mb-3 text-gray-300">详细数据对比</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 px-3 text-gray-400 font-medium">仓库</th>
                    <th className="text-right py-2 px-3 text-gray-400 font-medium">总分</th>
                    <th className="text-right py-2 px-3 text-gray-400 font-medium">Stars</th>
                    <th className="text-right py-2 px-3 text-gray-400 font-medium">Forks</th>
                    <th className="text-right py-2 px-3 text-gray-400 font-medium">贡献者</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map(repo => (
                    <tr key={repo.fullName} className="border-b border-white/5">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleRepo(repo.fullName)}
                            className="text-red-400 hover:text-red-300"
                            title="移除"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <span className="text-cyan-400">{repo.fullName}</span>
                        </div>
                      </td>
                      <td className="text-right py-3 px-3 font-semibold">
                        {repo.overall}
                      </td>
                      <td className="text-right py-3 px-3 text-gray-300">
                        {repo.stars.toLocaleString()}
                      </td>
                      <td className="text-right py-3 px-3 text-gray-300">
                        {repo.forks.toLocaleString()}
                      </td>
                      <td className="text-right py-3 px-3 text-gray-300">
                        {repo.contributors}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {comparisonData.length === 1 && (
        <p className="text-gray-400 text-sm text-center py-8">
          请至少选择两个仓库进行比较
        </p>
      )}
    </div>
  );
}
