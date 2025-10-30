import { Octokit } from '@octokit/rest';
import type { RepoInfo, AnalysisResult, HealthScore, RateLimit } from '../types';
import { cacheService } from '../utils/cache';
import { ErrorHandler } from '../utils/error';
import { config } from '../config/env';
import { CACHE_CONSTANTS } from '../constants/cache';
import { API_CONSTANTS } from '../constants/api';

export class GitHubService {
  private octokit: Octokit;
  private cache = cacheService;

  constructor(token?: string) {
    // 优先级：传入的token > localStorage > 环境变量
    const localToken = typeof window !== 'undefined' 
      ? localStorage.getItem('github_token') 
      : null;
    const authToken = token || localToken || config.github.token;
    
    this.octokit = new Octokit({
      auth: authToken || undefined,
    });
  }

  async analyzeRepository(owner: string, repo: string): Promise<AnalysisResult> {
    // 验证输入
    const validationError = ErrorHandler.validateRepoInput(`${owner}/${repo}`);
    if (validationError) {
      throw validationError;
    }

    // 生成缓存键
    const cacheKey = `${CACHE_CONSTANTS.KEYS.REPO_ANALYSIS}_${owner}_${repo}`;
    
    // 尝试从缓存获取
    const cached = this.cache.get<AnalysisResult>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // 获取仓库基本信息
      const { data: repoData } = await this.octokit.repos.get({
        owner,
        repo,
      });

      // 并行获取数据以提高性能
      const [
        { data: commits },
        { data: contributors },
        { data: closedIssues },
        { data: closedPRs }
      ] = await Promise.all([
        this.octokit.repos.listCommits({
          owner,
          repo,
          per_page: API_CONSTANTS.PER_PAGE.COMMITS,
        }),
        this.octokit.repos.listContributors({
          owner,
          repo,
          per_page: API_CONSTANTS.PER_PAGE.CONTRIBUTORS,
        }),
        this.octokit.issues.listForRepo({
          owner,
          repo,
          state: 'closed',
          per_page: API_CONSTANTS.PER_PAGE.ISSUES,
        }),
        this.octokit.pulls.list({
          owner,
          repo,
          state: 'closed',
          per_page: API_CONSTANTS.PER_PAGE.PULL_REQUESTS,
        })
      ]);

      // 检查README (不影响主流程)
      let hasReadme = false;
      try {
        await this.octokit.repos.getReadme({ owner, repo });
        hasReadme = true;
      } catch {
        hasReadme = false;
      }

      // 计算健康度评分
      const healthScore = this.calculateHealthScore({
        repoData: repoData as RepoInfo,
        commits,
        hasReadme,
        contributors,
        openIssuesCount: repoData.open_issues_count,
        closedIssuesCount: closedIssues.length,
      });

      const result: AnalysisResult = {
        repo: repoData as RepoInfo,
        commits: commits as never[],
        contributors: contributors as never[],
        healthScore,
        analyzedAt: new Date().toISOString(),
        issues: {
          open: repoData.open_issues_count,
          closed: closedIssues.length,
        },
        pullRequests: {
          open: repoData.open_issues_count, // GitHub API 将 PR 也计入 issues
          merged: closedPRs.filter((pr: { merged_at?: string | null }) => pr.merged_at).length,
        },
      };

      // 缓存结果
      this.cache.set(cacheKey, result, CACHE_CONSTANTS.DURATION.REPO_ANALYSIS);

      return result;
    } catch (error: unknown) {
      // 使用错误处理器统一处理
      throw ErrorHandler.handle(error);
    }
  }

  private calculateHealthScore(data: {
    repoData: RepoInfo;
    commits: unknown[];
    hasReadme: boolean;
    contributors: unknown[];
    openIssuesCount: number;
    closedIssuesCount: number;
  }): HealthScore {
    const { repoData, commits, hasReadme, contributors, openIssuesCount, closedIssuesCount } = data;

    // 文档评分 (0-100)
    let documentation = 0;
    if (hasReadme) documentation += 40;
    if (repoData.license) documentation += 30;
    if (repoData.description) documentation += 20;
    if (repoData.topics && repoData.topics.length > 0) documentation += 10;

    // 活跃度评分 (0-100)
    const daysSinceLastPush = (Date.now() - new Date(repoData.pushed_at).getTime()) / (1000 * 60 * 60 * 24);
    let activity = 0;
    if (daysSinceLastPush < 7) activity = 100;
    else if (daysSinceLastPush < 30) activity = 80;
    else if (daysSinceLastPush < 90) activity = 60;
    else if (daysSinceLastPush < 180) activity = 40;
    else if (daysSinceLastPush < 365) activity = 20;
    else activity = 10;

    // 社区评分 (0-100)
    const starsScore = Math.min((repoData.stargazers_count / 100) * 30, 30);
    const forksScore = Math.min((repoData.forks_count / 50) * 30, 30);
    const contributorsScore = Math.min((contributors.length / 10) * 40, 40);
    const community = starsScore + forksScore + contributorsScore;

    // 维护评分 (0-100)
    const issueResponseRate = closedIssuesCount / (openIssuesCount + closedIssuesCount + 1);
    const maintenance = Math.min(issueResponseRate * 100, 100);

    // 代码质量评分 (基于提交频率和规律性)
    const commitFrequency = commits.length;
    let codeQuality = 50; // 基础分
    if (commitFrequency > 50) codeQuality += 30;
    else if (commitFrequency > 20) codeQuality += 20;
    else if (commitFrequency > 10) codeQuality += 10;
    
    if (contributors.length > 5) codeQuality += 20;
    else if (contributors.length > 2) codeQuality += 10;

    codeQuality = Math.min(codeQuality, 100);

    // 综合评分
    const overall = Math.round(
      (codeQuality * 0.25 + documentation * 0.2 + activity * 0.25 + community * 0.15 + maintenance * 0.15)
    );

    return {
      overall,
      codeQuality: Math.round(codeQuality),
      documentation: Math.round(documentation),
      activity: Math.round(activity),
      community: Math.round(community),
      maintenance: Math.round(maintenance),
    };
  }

  async searchRepositories(query: string, perPage: number = 10): Promise<RepoInfo[]> {
    // 生成缓存键
    const cacheKey = `${CACHE_CONSTANTS.KEYS.SEARCH_RESULTS}_${query}_${perPage}`;
    
    // 尝试从缓存获取
    const cached = this.cache.get<RepoInfo[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const { data } = await this.octokit.search.repos({
        q: query,
        sort: 'stars',
        order: 'desc',
        per_page: perPage,
      });

      const results = data.items as RepoInfo[];

      // 缓存搜索结果
      this.cache.set(cacheKey, results, CACHE_CONSTANTS.DURATION.SEARCH_RESULTS);

      return results;
    } catch (error: unknown) {
      throw ErrorHandler.handle(error);
    }
  }

  /**
   * 清除指定仓库的缓存
   */
  clearCache(owner?: string, repo?: string): void {
    if (owner && repo) {
      const cacheKey = `${CACHE_CONSTANTS.KEYS.REPO_ANALYSIS}_${owner}_${repo}`;
      this.cache.remove(cacheKey);
    } else {
      this.cache.clear();
    }
  }

  /**
   * 获取API限流状态
   */
  async getRateLimit(): Promise<RateLimit> {
    try {
      const { data } = await this.octokit.rateLimit.get();
      
      // GitHub API 返回的数据结构：data.resources.core
      // 参考：https://docs.github.com/en/rest/rate-limit
      const rateData = data.resources?.core || data.rate;
      
      if (!rateData) {
        console.error('Invalid rate limit data structure:', data);
        throw new Error('Invalid rate limit response from GitHub API');
      }
      
      return {
        limit: rateData.limit,
        remaining: rateData.remaining,
        reset: rateData.reset,
        used: rateData.used,
      };
    } catch (error) {
      console.error('Failed to fetch rate limit:', error);
      throw ErrorHandler.handle(error);
    }
  }
}

// 创建默认实例，使用环境变量中的token
export const githubService = new GitHubService();
