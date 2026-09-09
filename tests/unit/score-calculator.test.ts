import { ScoreCalculator } from '../../src/core/score/ScoreCalculator';
import type { ScoreInput, ChallengeMetrics, ManualEvaluation } from '../../src/core/score/types';

describe('ScoreCalculator', () => {
  let calculator: ScoreCalculator;

  beforeEach(() => {
    calculator = new ScoreCalculator();
  });

  const createValidMetrics = (): ChallengeMetrics => ({
    domainFilesChanged: 8,
    cyclomaticComplexityDelta: 7,
    assertionsAdded: 9,
    diffCoverage: 85,
    lintPassed: true,
  });

  const createValidEvaluation = (): ManualEvaluation => ({
    roadmapImpact: 4,
    codeQuality: 5,
    documentationClarity: 3,
  });

  const createValidInput = (): ScoreInput => ({
    metrics: createValidMetrics(),
    evaluation: createValidEvaluation(),
  });

  describe('calculateAutoScore', () => {
    it('should calculate autoScore correctly with all metrics present', () => {
      const metrics: ChallengeMetrics = {
        domainFilesChanged: 10,
        cyclomaticComplexityDelta: 10,
        assertionsAdded: 10,
        diffCoverage: 100,
        lintPassed: true,
      };
      const result = calculator.calculateAutoScore(metrics);
      expect(result.score).toBe(10);
      expect(result.breakdown.domainFilesChanged).toBe(10);
      expect(result.breakdown.cyclomaticComplexityDelta).toBe(10);
      expect(result.breakdown.assertionsAdded).toBe(10);
      expect(result.breakdown.diffCoverage).toBe(10);
      expect(result.breakdown.lintPassed).toBe(10);
      expect(result.penaltyApplied).toBe(false);
    });

    it('should return 0 autoScore when metrics are missing (penalty applied)', () => {
      const result = calculator.calculateAutoScore(null as any);
      expect(result.score).toBe(0);
      expect(result.penaltyApplied).toBe(true);
    });

    it('should calculate weighted autoScore correctly', () => {
      const metrics: ChallengeMetrics = {
        domainFilesChanged: 5,
        cyclomaticComplexityDelta: 6,
        assertionsAdded: 7,
        diffCoverage: 50,
        lintPassed: false,
      };
      const result = calculator.calculateAutoScore(metrics);
      // Each metric has 20% weight
      // (5*0.2 + 6*0.2 + 7*0.2 + 5*0.2 + 0*0.2) = 1 + 1.2 + 1.4 + 1 + 0 = 4.6
      expect(result.score).toBeCloseTo(4.6, 2);
      expect(result.penaltyApplied).toBe(false);
    });

    it('should handle lintPassed as binary (0 or 10)', () => {
      const metricsTrue: ChallengeMetrics = {
        domainFilesChanged: 0,
        cyclomaticComplexityDelta: 0,
        assertionsAdded: 0,
        diffCoverage: 0,
        lintPassed: true,
      };
      const resultTrue = calculator.calculateAutoScore(metricsTrue);
      expect(resultTrue.breakdown.lintPassed).toBe(10);

      const metricsFalse: ChallengeMetrics = {
        domainFilesChanged: 0,
        cyclomaticComplexityDelta: 0,
        assertionsAdded: 0,
        diffCoverage: 0,
        lintPassed: false,
      };
      const resultFalse = calculator.calculateAutoScore(metricsFalse);
      expect(resultFalse.breakdown.lintPassed).toBe(0);
    });

    it('should clamp metrics to 0-10 range', () => {
      const metrics: ChallengeMetrics = {
        domainFilesChanged: 15,
        cyclomaticComplexityDelta: -5,
        assertionsAdded: 20,
        diffCoverage: 150,
        lintPassed: true,
      };
      const result = calculator.calculateAutoScore(metrics);
      expect(result.breakdown.domainFilesChanged).toBeLessThanOrEqual(10);
      expect(result.breakdown.cyclomaticComplexityDelta).toBeGreaterThanOrEqual(0);
      expect(result.breakdown.diffCoverage).toBeLessThanOrEqual(10);
    });

    it('should round score to 2 decimal places', () => {
      const metrics: ChallengeMetrics = {
        domainFilesChanged: 7,
        cyclomaticComplexityDelta: 7,
        assertionsAdded: 7,
        diffCoverage: 70,
        lintPassed: true,
      };
      const result = calculator.calculateAutoScore(metrics);
      const scoreStr = result.score.toString();
      const decimals = scoreStr.includes('.') ? scoreStr.split('.')[1].length : 0;
      expect(decimals).toBeLessThanOrEqual(2);
    });
  });

  describe('calculateManualScore', () => {
    it('should calculate manualScore correctly with valid evaluation', () => {
      const evaluation: ManualEvaluation = {
        roadmapImpact: 5,
        codeQuality: 5,
        documentationClarity: 5,
      };
      const result = calculator.calculateManualScore(evaluation);
      // roadmapImpact: 5*2 = 10, weight 50% -> 5
      // codeQuality: 5*2 = 10, weight 30% -> 3
      // documentationClarity: 5*2 = 10, weight 20% -> 2
      // Total: 5 + 3 + 2 = 10
      expect(result.score).toBe(10);
      expect(result.breakdown.roadmapImpact).toBe(10);
      expect(result.breakdown.codeQuality).toBe(10);
      expect(result.breakdown.documentationClarity).toBe(10);
    });

    it('should calculate minimum manualScore correctly', () => {
      const evaluation: ManualEvaluation = {
        roadmapImpact: 1,
        codeQuality: 1,
        documentationClarity: 1,
      };
      const result = calculator.calculateManualScore(evaluation);
      // roadmapImpact: 1*2 = 2, weight 50% -> 1
      // codeQuality: 1*2 = 2, weight 30% -> 0.6
      // documentationClarity: 1*2 = 2, weight 20% -> 0.4
      // Total: 1 + 0.6 + 0.4 = 2
      expect(result.score).toBeCloseTo(2, 2);
    });

    it('should apply weights correctly (50%, 30%, 20%)', () => {
      const evaluation: ManualEvaluation = {
        roadmapImpact: 4,
        codeQuality: 3,
        documentationClarity: 2,
      };
      const result = calculator.calculateManualScore(evaluation);
      // roadmapImpact: 4*2 = 8, weight 50% -> 4
      // codeQuality: 3*2 = 6, weight 30% -> 1.8
      // documentationClarity: 2*2 = 4, weight 20% -> 0.8
      // Total: 4 + 1.8 + 0.8 = 6.6
      expect(result.score).toBeCloseTo(6.6, 2);
    });

    it('should handle edge case values', () => {
      const evaluation: ManualEvaluation = {
        roadmapImpact: 3,
        codeQuality: 4,
        documentationClarity: 5,
      };
      const result = calculator.calculateManualScore(evaluation);
      // roadmapImpact: 3*2 = 6, weight 50% -> 3
      // codeQuality: 4*2 = 8, weight 30% -> 2.4
      // documentationClarity: 5*2 = 10, weight 20% -> 2
      // Total: 3 + 2.4 + 2 = 7.4
      expect(result.score).toBeCloseTo(7.4, 2);
    });
  });

  describe('calculate', () => {
    it('should calculate totalScore with formula (auto × 0.6) + (manual × 0.4)', () => {
      const input: ScoreInput = {
        metrics: {
          domainFilesChanged: 10,
          cyclomaticComplexityDelta: 10,
          assertionsAdded: 10,
          diffCoverage: 100,
          lintPassed: true,
        },
        evaluation: {
          roadmapImpact: 5,
          codeQuality: 5,
          documentationClarity: 5,
        },
      };
      const result = calculator.calculate(input);
      // autoScore = 10, manualScore = 10
      // totalScore = (10 × 0.6) + (10 × 0.4) = 6 + 4 = 10
      expect(result.totalScore).toBe(10);
      expect(result.autoScore).toBe(10);
      expect(result.manualScore).toBe(10);
    });

    it('should return versioned algorithm (score_v1)', () => {
      const input = createValidInput();
      const result = calculator.calculate(input);
      expect(result.algorithmVersion).toBe('score_v1');
    });

    it('should return complete breakdown for audit', () => {
      const input = createValidInput();
      const result = calculator.calculate(input);
      expect(result.breakdown.auto).toBeDefined();
      expect(result.breakdown.manual).toBeDefined();
      expect(result.breakdown.auto.domainFilesChanged).toBeDefined();
      expect(result.breakdown.auto.cyclomaticComplexityDelta).toBeDefined();
      expect(result.breakdown.auto.assertionsAdded).toBeDefined();
      expect(result.breakdown.auto.diffCoverage).toBeDefined();
      expect(result.breakdown.auto.lintPassed).toBeDefined();
      expect(result.breakdown.manual.roadmapImpact).toBeDefined();
      expect(result.breakdown.manual.codeQuality).toBeDefined();
      expect(result.breakdown.manual.documentationClarity).toBeDefined();
    });

    it('should handle missing metrics (autoScore = 0, penalty applied)', () => {
      const input: ScoreInput = {
        metrics: null as any,
        evaluation: createValidEvaluation(),
      };
      const result = calculator.calculate(input);
      expect(result.autoScore).toBe(0);
      expect(result.penaltyApplied).toBe(true);
      // manualScore should still be calculated
      expect(result.manualScore).toBeGreaterThan(0);
    });

    it('should round totalScore to 2 decimal places', () => {
      const input: ScoreInput = {
        metrics: {
          domainFilesChanged: 7,
          cyclomaticComplexityDelta: 7,
          assertionsAdded: 7,
          diffCoverage: 70,
          lintPassed: true,
        },
        evaluation: {
          roadmapImpact: 3,
          codeQuality: 4,
          documentationClarity: 5,
        },
      };
      const result = calculator.calculate(input);
      const scoreStr = result.totalScore.toString();
      const decimals = scoreStr.includes('.') ? scoreStr.split('.')[1].length : 0;
      expect(decimals).toBeLessThanOrEqual(2);
    });

    it('should maintain immutability (not modify input)', () => {
      const metrics = createValidMetrics();
      const evaluation = createValidEvaluation();
      const input: ScoreInput = { metrics, evaluation };

      const metricsCopy = { ...metrics };
      const evaluationCopy = { ...evaluation };

      calculator.calculate(input);

      expect(metrics).toEqual(metricsCopy);
      expect(evaluation).toEqual(evaluationCopy);
    });
  });
});
