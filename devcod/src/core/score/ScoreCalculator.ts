import { ScoreCriteria, ScoreResult, ScoreWeights, DEFAULT_WEIGHTS } from './types';

export class ScoreCalculator {
  private weights: ScoreWeights;

  constructor(weights: ScoreWeights = DEFAULT_WEIGHTS) {
    this.weights = weights;
  }

  calculate(criteria: ScoreCriteria): ScoreResult {
    const breakdown = {
      codeQuality: this.normalizeScore(criteria.codeQuality) * this.weights.codeQuality,
      testCoverage: this.normalizeScore(criteria.testCoverage) * this.weights.testCoverage,
      documentation: this.normalizeScore(criteria.documentation) * this.weights.documentation,
      performance: this.normalizeScore(criteria.performance) * this.weights.performance,
      security: this.normalizeScore(criteria.security) * this.weights.security,
    };

    const totalScore = Object.values(breakdown).reduce((sum, score) => sum + score, 0);

    return {
      totalScore: Math.round(totalScore * 100) / 100,
      breakdown,
      rank: this.determineRank(totalScore),
    };
  }

  private normalizeScore(score: number): number {
    if (score < 0 || score > 100) {
      throw new Error('Score must be between 0 and 100');
    }
    return score / 100;
  }

  private determineRank(totalScore: number): ScoreResult['rank'] {
    if (totalScore >= 90) return 'platinum';
    if (totalScore >= 75) return 'gold';
    if (totalScore >= 60) return 'silver';
    return 'bronze';
  }

  calculatePercentageDifference(before: ScoreResult, after: ScoreResult): number {
    if (before.totalScore === 0) return 100;
    return ((after.totalScore - before.totalScore) / before.totalScore) * 100;
  }
}
