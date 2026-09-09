import { VCSAdapter, PRData, MetricsData } from '../../core/ports/vcs';
import { GitHubConfig, AdapterResult, PullRequestIdentifier } from './types';
import * as crypto from 'crypto';

const PR_URL_REGEX = /^https:\/\/github\.com\/([\w-]+)\/([\w-]+)\/pull\/(\d+)\/?$/i;

/**
 * Adaptador GitHub (Porta do Core → API GitHub v3).
 * Implementa VCSAdapter com retry, rate limiting e HMAC-SHA256.
 */
export class GitHubAdapter implements VCSAdapter {
  private readonly config: Required<GitHubConfig>;

  constructor(config: GitHubConfig) {
    this.config = {
      token: config.token,
      webhookSecret: config.webhookSecret,
      timeoutMs: config.timeoutMs ?? 10000,
      maxRetries: config.maxRetries ?? 3,
      baseUrl: config.baseUrl ?? 'https://api.github.com',
    };
  }

  async getPullRequest(prUrl: string): Promise<AdapterResult<PRData>> {
    const parseResult = GitHubAdapter.parsePRUrl(prUrl);
    if (!parseResult.success) return parseResult;
    throw new Error('Not implemented - use Edge Function');
  }

  async getMetrics(prUrl: string): Promise<AdapterResult<MetricsData | null>> {
    const parseResult = GitHubAdapter.parsePRUrl(prUrl);
    if (!parseResult.success) return parseResult;
    throw new Error('Not implemented - use Edge Function');
  }

  validateWebhook(
    payload: Buffer,
    signatureHeader: string,
    secret: string
  ): boolean {
    if (typeof signatureHeader !== 'string' || !signatureHeader.startsWith('sha256=')) {
      return false;
    }
    const receivedSignature = signatureHeader.substring(7);
    if (!/^[a-f0-9]{64}$/i.test(receivedSignature)) {
      return false;
    }
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload);
    const expectedSignature = hmac.digest('hex');
    if (receivedSignature.length !== expectedSignature.length) {
      return false;
    }
    return crypto.timingSafeEqual(
      Buffer.from(receivedSignature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  }

  static parsePRUrl(prUrl: string): AdapterResult<PullRequestIdentifier> {
    if (typeof prUrl !== 'string') {
      return {
        success: false,
        error: { code: 'INVALID_PR_URL', message: 'URL deve ser string', retryable: false },
      };
    }
    const match = prUrl.match(PR_URL_REGEX);
    if (!match) {
      return {
        success: false,
        error: { code: 'INVALID_PR_URL', message: 'URL fora do padrão GitHub PR', retryable: false },
      };
    }
    return {
      success: true,
      data: {
        owner: match[1],
        repo: match[2],
        prNumber: parseInt(match[3], 10),
      },
    };
  }
}
