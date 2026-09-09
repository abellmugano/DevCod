export interface MetricsData {
  domainFilesChanged: number;
  cyclomaticComplexityDelta: number;
  assertionsAdded: number;
  diffCoverage: number;
  lintPassed: boolean;
}

export interface ManualEvaluation {
  roadmapImpact: number;
  codeQuality: number;
  documentationClarity: number;
}

export interface ScoreInput {
  metrics: MetricsData | null;
  manualEvaluation: ManualEvaluation;
  algorithmVersion: string;
}

export interface ScoreResult {
  totalScore: number;
  autoScore: number;
  manualScore: number;
  metricsPresent: boolean;
  penaltyApplied: boolean;
  algorithmVersion: string;
  breakdown: ScoreBreakdown;
}

export interface ScoreBreakdown {
  domainFilesScore: number;
  complexityScore: number;
  assertionsScore: number;
  coverageScore: number;
  lintScore: number;
  roadmapImpactScore: number;
  codeQualityScore: number;
  documentationScore: number;
}

export interface ScoreCalculationError {
  field: string;
  code: 'INVALID_RANGE' | 'MISSING_DATA';
  message: string;
}
