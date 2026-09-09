/**
 * Contrato de Adaptação para Sistemas de Controle de Versão (v1).
 * O Core permanece isolado de provedores específicos.
 */
export interface PRData {
  id: string;
  url: string;
  authorId: string;
  state: 'open' | 'closed' | 'merged';
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

export interface VCSAdapter {
  getPullRequest(prUrl: string): Promise<PRData>;
  getMetrics(prUrl: string): Promise<MetricsData | null>;
  validateWebhook(payload: Buffer, signatureHeader: string, secret: string): boolean;
}
