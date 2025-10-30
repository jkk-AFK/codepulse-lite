import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { GitCommit, Users, TrendingUp, CheckCircle, GitPullRequest } from 'lucide-react';
import type { AnalysisResult } from '../types';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import RepoCard from './RepoCard';
import HealthRadar from './HealthRadar';
import ExportButton from './ExportButton';

interface AnalysisReportProps {
  result: AnalysisResult;
}

export default function AnalysisReport({ result }: AnalysisReportProps) {
  // 处理提交历史数据
  const commitData = result.commits.slice(0, 30).reverse().map((commit, index) => ({
    name: `#${index + 1}`,
    date: commit.commit.author?.date || '',
    message: commit.commit.message.split('\n')[0],
  }));

  // 贡献者数据
  const contributorData = result.contributors.slice(0, 10).map((contributor) => ({
    name: contributor.login,
    value: contributor.contributions,
  }));

  // 问题统计
  const issueData = [
    { name: '已关闭', value: result.issues.closed, color: '#10b981' },
    { name: '待处理', value: result.issues.open, color: '#ef4444' },
  ];

  // PR统计
  const prData = [
    { name: '已合并', value: result.pullRequests.merged, color: '#8b5cf6' },
    { name: '待处理', value: result.pullRequests.open, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* 导出按钮 */}
      <div className="flex justify-end">
        <ExportButton result={result} />
      </div>

      {/* 仓库基本信息 */}
      <RepoCard repo={result.repo} />

      {/* 健康度评分 */}
      <HealthRadar healthScore={result.healthScore} />

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">总提交数</p>
              <p className="text-3xl font-bold text-white mt-2">{result.commits.length}</p>
            </div>
            <div className="bg-blue-500/20 p-3 rounded-lg">
              <GitCommit className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">贡献者</p>
              <p className="text-3xl font-bold text-white mt-2">{result.contributors.length}</p>
            </div>
            <div className="bg-purple-500/20 p-3 rounded-lg">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Issues</p>
              <p className="text-3xl font-bold text-white mt-2">{result.issues.open + result.issues.closed}</p>
            </div>
            <div className="bg-green-500/20 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Pull Requests</p>
              <p className="text-3xl font-bold text-white mt-2">{result.pullRequests.open + result.pullRequests.merged}</p>
            </div>
            <div className="bg-orange-500/20 p-3 rounded-lg">
              <GitPullRequest className="w-6 h-6 text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 提交活跃度 */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold">最近提交活跃度</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={commitData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(17, 24, 39, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Line type="monotone" dataKey="name" stroke="#0ea5e9" strokeWidth={2} dot={{ fill: '#0ea5e9' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 贡献者分布 */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold">Top 10 贡献者</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={contributorData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: '10px' }} angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(17, 24, 39, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Issues状态 */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-bold">Issues 状态</h3>
          </div>
          <div className="flex items-center justify-between">
            <ResponsiveContainer width="60%" height={200}>
              <PieChart>
                <Pie
                  data={issueData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {issueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <div>
                  <p className="text-sm text-gray-400">已关闭</p>
                  <p className="text-xl font-bold">{result.issues.closed}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <div>
                  <p className="text-sm text-gray-400">待处理</p>
                  <p className="text-xl font-bold">{result.issues.open}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PR状态 */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <GitPullRequest className="w-5 h-5 text-orange-400" />
            <h3 className="text-lg font-bold">Pull Requests 状态</h3>
          </div>
          <div className="flex items-center justify-between">
            <ResponsiveContainer width="60%" height={200}>
              <PieChart>
                <Pie
                  data={prData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {prData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                <div>
                  <p className="text-sm text-gray-400">已合并</p>
                  <p className="text-xl font-bold">{result.pullRequests.merged}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                <div>
                  <p className="text-sm text-gray-400">待处理</p>
                  <p className="text-xl font-bold">{result.pullRequests.open}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 分析时间 */}
      <div className="text-center text-sm text-gray-400">
        分析时间: {format(new Date(result.analyzedAt), 'PPpp', { locale: zhCN })}
      </div>
    </div>
  );
}
