export interface PRData {
  id: string;
  url: string;
  authorId: string;
  state: "open" | "closed" | "merged";
  createdAt: string;
  mergedAt: string | null;
}

export interface MetricsData {
  domainFilesChanged: number;
  cyclomaticComplexityDelta: number;
  assertionsAdded: number;
  diffCoverage: number;
  lintPassed: boolean;
}

export interface GitHubConfig {
  token: string;
  webhookSecret: string;
}

const PR_URL_REGEX = /^https:\/\/github\.com\/([\w-]+)\/([\w-]+)\/pull\/(\d+)\/?$/i;

export class GitHubAdapter {
  private config: GitHubConfig;
  constructor(config: GitHubConfig) { this.config = config; }

  async getPullRequest(prUrl: string): Promise<PRData> {
    const parsed = GitHubAdapter.parsePRUrl(prUrl);
    if (!parsed.success) throw new Error(parsed.error.message);
    const { owner, repo, prNumber } = parsed.data;

    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`, {
      headers: { Authorization: `Bearer ${this.config.token}`, Accept: "application/vnd.github+json" },
    });
    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    const pr = await res.json();

    return {
      id: pr.id.toString(),
      url: pr.html_url,
      authorId: pr.user.id.toString(),
      state: pr.merged ? "merged" : pr.state,
      createdAt: pr.created_at,
      mergedAt: pr.merged_at,
    };
  }

  async getMetrics(prUrl: string): Promise<MetricsData | null> {
    const parsed = GitHubAdapter.parsePRUrl(prUrl);
    if (!parsed.success) return null;
    const { owner, repo, prNumber } = parsed.data;

    const prRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`, {
      headers: { Authorization: `Bearer ${this.config.token}`, Accept: "application/vnd.github+json" },
    });
    if (!prRes.ok) return null;
    const pr = await prRes.json();

    const metricsRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/metrics.json?ref=${pr.head.ref}`,
      { headers: { Authorization: `Bearer ${this.config.token}`, Accept: "application/vnd.github.raw+json" } }
    );
    if (!metricsRes.ok) return null;

    try {
      const m = JSON.parse(await metricsRes.text());
      return {
        domainFilesChanged: m.domainFilesChanged || 0,
        cyclomaticComplexityDelta: m.cyclomaticComplexityDelta || 0,
        assertionsAdded: m.assertionsAdded || 0,
        diffCoverage: m.diffCoverage || 0,
        lintPassed: m.lintPassed || false,
      };
    } catch {
      return null;
    }
  }

  // ✅ CORRIGIDO: agora é async e retorna Promise<boolean>
  async validateWebhook(payload: Uint8Array, signatureHeader: string, secret: string): Promise<boolean> {
    if (!signatureHeader.startsWith("sha256=")) return false;
    const received = signatureHeader.substring(7);
    if (!/^[a-f0-9]{64}$/i.test(received)) return false;

    const key = await crypto.subtle.importKey(
      "raw", new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
    );
    const sig = await crypto.subtle.sign("HMAC", key, payload);
    const expected = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");
    return received === expected;
  }

  static parsePRUrl(prUrl: string): { success: boolean; data?: { owner: string; repo: string; prNumber: number }; error?: { code: string; message: string } } {
    const match = prUrl.match(PR_URL_REGEX);
    if (!match) return { success: false, error: { code: "INVALID_PR_URL", message: "URL fora do padrão GitHub PR" } };
    return { success: true, data: { owner: match[1], repo: match[2], prNumber: parseInt(match[3], 10) } };
  }
}
