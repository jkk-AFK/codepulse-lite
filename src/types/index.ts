export interface RepoInfo {
  name: string;
  full_name: string;
  description: string | null;
  owner: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  default_branch: string;
  license: {
    name: string;
  } | null;
  topics: string[];
  has_issues: boolean;
  has_wiki: boolean;
  has_pages: boolean;
}

export interface Commit {
  sha: string;
  commit: {
    author: {
      name: string;
      date: string;
    };
    message: string;
  };
  author: {
    login: string;
    avatar_url: string;
  } | null;
}

export interface Contributor {
  login: string;
  avatar_url: string;
  contributions: number;
}

export interface HealthScore {
  overall: number;
  codeQuality: number;
  documentation: number;
  activity: number;
  community: number;
  maintenance: number;
}

export interface AnalysisResult {
  repo: RepoInfo;
  commits: Commit[];
  contributors: Contributor[];
  healthScore: HealthScore;
  analyzedAt: string;
  issues: {
    open: number;
    closed: number;
  };
  pullRequests: {
    open: number;
    merged: number;
  };
}

export interface StoredAnalysis {
  id: string;
  repoFullName: string;
  result: AnalysisResult;
  timestamp: number;
}

export interface RateLimit {
  limit: number;
  remaining: number;
  reset: number;
  used: number;
}
