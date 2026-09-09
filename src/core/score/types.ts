export interface ChallengeMetrics {
  domainFilesChanged: number; // 0-10
  cyclomaticComplexityDelta: number; // 0-10
  assertionsAdded: number; // 0-10
  diffCoverage: number; // 0-10
  lintPassed: boolean; // true/false
}

export interface ManualEvaluation {
  roadmapImpact: number; // 1-5
  codeQuality: number; // 1-5
  documentationClarity: number; // 1-5
}

export interface ScoreInput {
  metrics?: ChallengeMetrics;
  evaluation?: ManualEvaluation;
}

export interface ScoreBreakdown {
  autoScore: number;
  manualScore: number;
  totalScore: number;
  penaltyApplied: boolean;
  version: string;
  autoBreakdown: {
    domainFilesChanged: { value: number; weight: number; weighted: number };
    cyclomaticComplexityDelta: { value: number; weight: number; weighted: number };
    assertionsAdded: { value: number; weight: number; weighted: number };
    diffCoverage: { value: number; weight: number; weighted: number };
    lintPassed: { value: number; weight: number; weighted: number };
  };
  manualBreakdown: {
    roadmapImpact: { value: number; normalized: number; weight: number; weighted: number };
    codeQuality: { value: number; normalized: number; weight: number; weighted: number };
    documentationClarity: { value: number; normalized: number; weight: number; weighted: number };
  };
}
