import { GitHubUser, GitHubRepository, GitHubCommit, GitHubPullRequest } from './types';

const GITHUB_API_BASE = 'https://api.github.com';

export class GitHubClient {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/vnd.github.v3+json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getUser(username: string): Promise<GitHubUser> {
    return this.request<GitHubUser>(`/users/${username}`);
  }

  async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
    return this.request<GitHubRepository>(`/repos/${owner}/${repo}`);
  }

  async getUserRepositories(username: string): Promise<GitHubRepository[]> {
    return this.request<GitHubRepository[]>(`/users/${username}/repos?per_page=100`);
  }

  async getCommits(owner: string, repo: string, options?: {
    sha?: string;
    per_page?: number;
    since?: string;
  }): Promise<GitHubCommit[]> {
    const params = new URLSearchParams();
    if (options?.sha) params.append('sha', options.sha);
    if (options?.per_page) params.append('per_page', options.per_page.toString());
    if (options?.since) params.append('since', options.since);

    const queryString = params.toString();
    const endpoint = `/repos/${owner}/${repo}/commits${queryString ? `?${queryString}` : ''}`;
    return this.request<GitHubCommit[]>(endpoint);
  }

  async getPullRequests(owner: string, repo: string, state?: 'open' | 'closed' | 'all'): Promise<GitHubPullRequest[]> {
    const params = new URLSearchParams();
    if (state) params.append('state', state);
    
    const queryString = params.toString();
    const endpoint = `/repos/${owner}/${repo}/pulls${queryString ? `?${queryString}` : ''}`;
    return this.request<GitHubPullRequest[]>(endpoint);
  }

  async getPullRequest(owner: string, repo: string, pullNumber: number): Promise<GitHubPullRequest> {
    return this.request<GitHubPullRequest>(`/repos/${owner}/${repo}/pulls/${pullNumber}`);
  }

  async verifyRepositoryAccess(owner: string, repo: string): Promise<boolean> {
    try {
      await this.getRepository(owner, repo);
      return true;
    } catch {
      return false;
    }
  }

  async getContributionStats(owner: string, repo: string, since: Date): Promise<{
    totalCommits: number;
    totalAdditions: number;
    totalDeletions: number;
  }> {
    const commits = await this.getCommits(owner, repo, {
      since: since.toISOString(),
      per_page: 100,
    });

    return commits.reduce(
      (acc, commit) => ({
        totalCommits: acc.totalCommits + 1,
        totalAdditions: acc.totalAdditions + (commit.stats?.additions || 0),
        totalDeletions: acc.totalDeletions + (commit.stats?.deletions || 0),
      }),
      { totalCommits: 0, totalAdditions: 0, totalDeletions: 0 }
    );
  }
}

// Factory function for creating GitHub client
export function createGitHubClient(token: string): GitHubClient {
  return new GitHubClient(token);
}
