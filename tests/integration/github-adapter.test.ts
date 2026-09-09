import { GitHubAdapter } from '../../src/adapters/vcs/GitHubAdapter';
import * as crypto from 'crypto';

describe('GitHubAdapter', () => {
  const webhookSecret = 'test-secret';

  it('deve parsear URL válida de PR do GitHub', () => {
    const result = GitHubAdapter.parsePRUrl('https://github.com/devcod/devcod/pull/42');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ owner: 'devcod', repo: 'devcod', prNumber: 42 });
    }
  });

  it('deve rejeitar URL fora do padrão GitHub', () => {
    const result = GitHubAdapter.parsePRUrl('https://gitlab.com/x/y/-/merge_requests/1');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('INVALID_PR_URL');
    }
  });

  it('deve validar webhook com assinatura HMAC correta', () => {
    const adapter = new GitHubAdapter({ token: 't', webhookSecret });
    const payload = Buffer.from(JSON.stringify({ action: 'opened' }));
    const hmac = crypto.createHmac('sha256', webhookSecret);
    hmac.update(payload);
    const validSignature = `sha256=${hmac.digest('hex')}`;
    expect(adapter.validateWebhook(payload, validSignature, webhookSecret)).toBe(true);
  });

  it('deve rejeitar webhook com assinatura incorreta', () => {
    const adapter = new GitHubAdapter({ token: 't', webhookSecret });
    const payload = Buffer.from(JSON.stringify({ action: 'opened' }));
    const invalidSignature = 'sha256=0000000000000000000000000000000000000000000000000000000000000000';
    expect(adapter.validateWebhook(payload, invalidSignature, webhookSecret)).toBe(false);
  });

  it('deve rejeitar webhook com payload alterado', () => {
    const adapter = new GitHubAdapter({ token: 't', webhookSecret });
    const originalPayload = Buffer.from(JSON.stringify({ action: 'opened' }));
    const hmac = crypto.createHmac('sha256', webhookSecret);
    hmac.update(originalPayload);
    const signature = `sha256=${hmac.digest('hex')}`;
    const tamperedPayload = Buffer.from(JSON.stringify({ action: 'closed' }));
    expect(adapter.validateWebhook(tamperedPayload, signature, webhookSecret)).toBe(false);
  });

  it('deve rejeitar header sem prefixo sha256=', () => {
    const adapter = new GitHubAdapter({ token: 't', webhookSecret });
    const payload = Buffer.from('test');
    expect(adapter.validateWebhook(payload, 'invalid-format', webhookSecret)).toBe(false);
  });
});
