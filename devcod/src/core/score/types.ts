export interface ScoreCriteria {
  codeQuality: number; // 0-100
  testCoverage: number; // 0-100
  documentation: number; // 0-100
  performance: number; // 0-100
  security: number; // 0-100
}

export interface ScoreWeights {
  codeQuality: number;
  testCoverage: number;
  documentation: number;
  performance: number;
  security: number;
}

export interface ScoreResult {
  totalScore: number;
  breakdown: {
    codeQuality: number;
    testCoverage: number;
    documentation: number;
    performance: number;
    security: number;
  };
  rank: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export const DEFAULT_WEIGHTS: ScoreWeights = {
  codeQuality: 0.3,
  testCoverage: 0.25,
  documentation: 0.15,
  performance: 0.15,
  security: 0.15,
};
