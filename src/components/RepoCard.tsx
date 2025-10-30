import { Star, GitFork, AlertCircle, ExternalLink, Calendar, Code, Scale } from 'lucide-react';
import type { RepoInfo } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface RepoCardProps {
  repo: RepoInfo;
}

export default function RepoCard({ repo }: RepoCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="glass-card p-6 hover:bg-white/10 transition-all duration-300">
      <div className="flex items-start gap-4">
        {/* 头像 */}
        <img
          src={repo.owner.avatar_url}
          alt={repo.owner.login}
          className="w-16 h-16 rounded-lg border-2 border-white/20"
        />

        {/* 主要信息 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-white truncate">
                {repo.name}
              </h3>
              <p className="text-sm text-gray-400">
                {repo.owner.login}
              </p>
            </div>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary py-1 px-3 text-xs flex items-center gap-1 flex-shrink-0"
            >
              <ExternalLink className="w-3 h-3" />
              访问
            </a>
          </div>

          {/* 描述 */}
          {repo.description && (
            <p className="mt-3 text-gray-300 text-sm line-clamp-2">
              {repo.description}
            </p>
          )}

          {/* 统计数据 */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-yellow-400">
              <Star className="w-4 h-4" />
              <span>{formatNumber(repo.stargazers_count)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-blue-400">
              <GitFork className="w-4 h-4" />
              <span>{formatNumber(repo.forks_count)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span>{formatNumber(repo.open_issues_count)} Issues</span>
            </div>
            {repo.language && (
              <div className="flex items-center gap-1.5 text-green-400">
                <Code className="w-4 h-4" />
                <span>{repo.language}</span>
              </div>
            )}
          </div>

          {/* 额外信息 */}
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              <span>
                更新于 {formatDistanceToNow(new Date(repo.updated_at), { addSuffix: true, locale: zhCN })}
              </span>
            </div>
            {repo.license && (
              <div className="flex items-center gap-1.5">
                <Scale className="w-3 h-3" />
                <span>{repo.license.name}</span>
              </div>
            )}
          </div>

          {/* 标签 */}
          {repo.topics && repo.topics.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {repo.topics.slice(0, 5).map((topic) => (
                <span
                  key={topic}
                  className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-md border border-blue-500/30"
                >
                  {topic}
                </span>
              ))}
              {repo.topics.length > 5 && (
                <span className="px-2 py-1 text-gray-400 text-xs">
                  +{repo.topics.length - 5}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
