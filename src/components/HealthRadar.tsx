import { Activity, GitBranch, TrendingUp, Users, FileText, Shield } from 'lucide-react';
import type { HealthScore } from '../types';

interface HealthRadarProps {
  healthScore: HealthScore;
}

export default function HealthRadar({ healthScore }: HealthRadarProps) {
  const metrics = [
    { label: '代码质量', value: healthScore.codeQuality, icon: GitBranch, color: 'from-blue-500 to-cyan-500' },
    { label: '文档完整', value: healthScore.documentation, icon: FileText, color: 'from-purple-500 to-pink-500' },
    { label: '活跃度', value: healthScore.activity, icon: Activity, color: 'from-green-500 to-emerald-500' },
    { label: '社区参与', value: healthScore.community, icon: Users, color: 'from-orange-500 to-red-500' },
    { label: '维护质量', value: healthScore.maintenance, icon: Shield, color: 'from-indigo-500 to-purple-500' },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B+';
    if (score >= 60) return 'B';
    if (score >= 50) return 'C';
    return 'D';
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-6 h-6 text-cyan-400" />
        <h2 className="text-2xl font-bold">健康度评分</h2>
      </div>

      {/* 总分显示 */}
      <div className="text-center mb-8">
        <div className={`text-6xl font-bold mb-2 ${getScoreColor(healthScore.overall)}`}>
          {healthScore.overall}
        </div>
        <div className="text-xl text-gray-400">
          综合评分 <span className={`font-bold ${getScoreColor(healthScore.overall)}`}>
            {getScoreGrade(healthScore.overall)}
          </span>
        </div>
      </div>

      {/* 各项指标 */}
      <div className="space-y-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium">{metric.label}</span>
                </div>
                <span className={`text-lg font-bold ${getScoreColor(metric.value)}`}>
                  {metric.value}
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${metric.color} transition-all duration-1000 ease-out`}
                  style={{ width: `${metric.value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* 评分说明 */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <p className="text-sm text-gray-400">
          <span className="font-semibold text-white">评分标准：</span>
          90+ (A+) 优秀 | 80+ (A) 良好 | 60+ (B) 中等 | 40+ (C) 需改进 | 40- (D) 较差
        </p>
      </div>
    </div>
  );
}
