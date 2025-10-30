/**
 * 导出报告组件
 * 支持导出 JSON 格式的分析报告
 */

import { Download, FileJson } from 'lucide-react';
import type { AnalysisResult } from '../types';

interface ExportButtonProps {
  result: AnalysisResult;
  disabled?: boolean;
}

export default function ExportButton({ result, disabled }: ExportButtonProps) {
  const handleExport = () => {
    try {
      // 准备导出数据
      const exportData = {
        repository: {
          name: result.repo.full_name,
          description: result.repo.description,
          url: result.repo.html_url,
          language: result.repo.language,
          stars: result.repo.stargazers_count,
          forks: result.repo.forks_count,
          license: result.repo.license?.name || 'None',
        },
        healthScore: result.healthScore,
        statistics: {
          openIssues: result.issues.open,
          closedIssues: result.issues.closed,
          openPullRequests: result.pullRequests.open,
          mergedPullRequests: result.pullRequests.merged,
          totalCommits: result.commits.length,
          totalContributors: result.contributors.length,
        },
        recentCommits: result.commits.slice(0, 10).map(commit => ({
          sha: commit.sha.substring(0, 7),
          author: commit.commit.author.name,
          date: commit.commit.author.date,
          message: commit.commit.message.split('\n')[0], // 只取第一行
        })),
        topContributors: result.contributors.slice(0, 10).map(contributor => ({
          username: contributor.login,
          contributions: contributor.contributions,
        })),
        analyzedAt: result.analyzedAt,
        exportedAt: new Date().toISOString(),
      };

      // 创建 Blob
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });

      // 创建下载链接
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${result.repo.full_name.replace('/', '-')}-analysis-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('导出失败，请重试');
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={disabled}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 
                 hover:bg-cyan-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title="导出分析报告为 JSON 格式"
    >
      <FileJson className="w-4 h-4" />
      <span className="text-sm font-medium">导出报告</span>
      <Download className="w-4 h-4" />
    </button>
  );
}
