import { PRData, MetricsData } from '../../core/ports/vcs';

export interface GitHubConfig {
  token: string;
  webhookSecret: string;
  timeoutMs?: number;
  maxRetries?: number;
  baseUrl?: string;
}

export type AdapterResult<T> =
  | { success: true; data: T; rateLimit?: RateLimitInfo }
  | { success: false; error: AdapterError };

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetAt: string;
}

export interface AdapterError {
  code: AdapterErrorCode;
  message: string;
  statusCode?: number;
  retryable: boolean;
}

export type AdapterErrorCode =
  | 'PR_NOT_FOUND'
  | 'REPO_NOT_FOUND'
  | 'METRICS_FILE_NOT_FOUND'
  | 'INVALID_WEBHOOK_SIGNATURE'
  | 'INVALID_WEBHOOK_PAYLOAD'
  | 'AUTHENTICATION_FAILED'
  | 'TOKEN_EXPIRED'
  | 'RATE_LIMIT_EXCEEDED'
  | 'TIMEOUT'
  | 'NETWORK_ERROR'
  | 'INVALID_PR_URL'
  | 'GITHUB_API_ERROR';

export interface PullRequestIdentifier {
  owner: string;
  repo: string;
  prNumber: number;
}
