/**
 * 历史记录组件
 * 显示最近分析过的仓库
 */

import { Clock, Trash2, Star } from 'lucide-react';
import type { StoredAnalysis } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface HistoryPanelProps {
  onSelect: (owner: string, repo: string) => void;
  onClear: () => void;
  onToggleFavorite?: (id: string) => void;
}

export default function HistoryPanel({ onSelect, onClear, onToggleFavorite }: HistoryPanelProps) {
  const history = JSON.parse(localStorage.getItem('analysis_history') || '[]') as StoredAnalysis[];
  const favorites = new Set(JSON.parse(localStorage.getItem('favorites') || '[]') as string[]);

  if (history.length === 0) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold">分析历史</h3>
        </div>
        <p className="text-gray-400 text-sm text-center py-8">
          暂无分析历史
        </p>
      </div>
    );
  }

  const handleToggleFavorite = (id: string, repoFullName: string) => {
    const newFavorites = new Set(favorites);
    if (favorites.has(repoFullName)) {
      newFavorites.delete(repoFullName);
    } else {
      newFavorites.add(repoFullName);
    }
    localStorage.setItem('favorites', JSON.stringify([...newFavorites]));
    onToggleFavorite?.(id);
  };

  const handleClear = () => {
    if (window.confirm('确定要清除所有历史记录吗？')) {
      onClear();
    }
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold">分析历史</h3>
          <span className="text-sm text-gray-400">({history.length})</span>
        </div>
        <button
          onClick={handleClear}
          className="text-sm text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1"
        >
          <Trash2 className="w-4 h-4" />
          清除
        </button>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {history.map((item) => {
          const isFavorite = favorites.has(item.repoFullName);
          const score = item.result.healthScore.overall;
          const scoreColor = score >= 80 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400';

          return (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
            >
              <button
                onClick={() => handleToggleFavorite(item.id, item.repoFullName)}
                className="flex-shrink-0"
              >
                <Star
                  className={`w-4 h-4 transition-colors ${
                    isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-500 group-hover:text-yellow-400'
                  }`}
                />
              </button>

              <button
                onClick={() => {
                  const [owner, repo] = item.repoFullName.split('/');
                  onSelect(owner, repo);
                }}
                className="flex-1 text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-cyan-400 hover:text-cyan-300">
                    {item.repoFullName}
                  </span>
                  <span className={`text-sm font-semibold ${scoreColor}`}>
                    {score}分
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {formatDistanceToNow(item.timestamp, { addSuffix: true, locale: zhCN })}
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
