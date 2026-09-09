import { ScoreCalculator } from '../../src/core/score/ScoreCalculator';
import { ScoreCriteria, DEFAULT_WEIGHTS } from '../../src/core/score/types';

describe('ScoreCalculator', () => {
  let calculator: ScoreCalculator;

  beforeEach(() => {
    calculator = new ScoreCalculator();
  });

  describe('calculate', () => {
    it('should calculate total score correctly with default weights', () => {
      const criteria: ScoreCriteria = {
        codeQuality: 80,
        testCoverage: 90,
        documentation: 70,
        performance: 85,
        security: 95,
      };

      const result = calculator.calculate(criteria);

      const expectedScore =
        80 * DEFAULT_WEIGHTS.codeQuality +
        90 * DEFAULT_WEIGHTS.testCoverage +
        70 * DEFAULT_WEIGHTS.documentation +
        85 * DEFAULT_WEIGHTS.performance +
        95 * DEFAULT_WEIGHTS.security;

      expect(result.totalScore).toBeCloseTo(expectedScore, 2);
    });

    it('should return correct rank based on score', () => {
      const platinumCriteria: ScoreCriteria = {
        codeQuality: 95,
        testCoverage: 95,
        documentation: 95,
        performance: 95,
        security: 95,
      };
      expect(calculator.calculate(platinumCriteria).rank).toBe('platinum');

      const goldCriteria: ScoreCriteria = {
        codeQuality: 80,
        testCoverage: 80,
        documentation: 80,
        performance: 80,
        security: 80,
      };
      expect(calculator.calculate(goldCriteria).rank).toBe('gold');

      const silverCriteria: ScoreCriteria = {
        codeQuality: 65,
        testCoverage: 65,
        documentation: 65,
        performance: 65,
        security: 65,
      };
      expect(calculator.calculate(silverCriteria).rank).toBe('silver');

      const bronzeCriteria: ScoreCriteria = {
        codeQuality: 50,
        testCoverage: 50,
        documentation: 50,
        performance: 50,
        security: 50,
      };
      expect(calculator.calculate(bronzeCriteria).rank).toBe('bronze');
    });

    it('should throw error for score out of range', () => {
      const invalidCriteria: ScoreCriteria = {
        codeQuality: 110,
        testCoverage: 90,
        documentation: 70,
        performance: 85,
        security: 95,
      };

      expect(() => calculator.calculate(invalidCriteria)).toThrow(
        'Score must be between 0 and 100'
      );
    });

    it('should throw error for negative score', () => {
      const invalidCriteria: ScoreCriteria = {
        codeQuality: -10,
        testCoverage: 90,
        documentation: 70,
        performance: 85,
        security: 95,
      };

      expect(() => calculator.calculate(invalidCriteria)).toThrow(
        'Score must be between 0 and 100'
      );
    });

    it('should use custom weights when provided', () => {
      const customWeights = {
        codeQuality: 0.5,
        testCoverage: 0.3,
        documentation: 0.1,
        performance: 0.05,
        security: 0.05,
      };

      const customCalculator = new ScoreCalculator(customWeights);

      const criteria: ScoreCriteria = {
        codeQuality: 100,
        testCoverage: 0,
        documentation: 0,
        performance: 0,
        security: 0,
      };

      const result = customCalculator.calculate(criteria);
      expect(result.totalScore).toBe(50); // 100 * 0.5
    });

    it('should return detailed breakdown', () => {
      const criteria: ScoreCriteria = {
        codeQuality: 80,
        testCoverage: 90,
        documentation: 70,
        performance: 85,
        security: 95,
      };

      const result = calculator.calculate(criteria);

      expect(result.breakdown.codeQuality).toBeCloseTo(
        80 * DEFAULT_WEIGHTS.codeQuality,
        2
      );
      expect(result.breakdown.testCoverage).toBeCloseTo(
        90 * DEFAULT_WEIGHTS.testCoverage,
        2
      );
      expect(result.breakdown.documentation).toBeCloseTo(
        70 * DEFAULT_WEIGHTS.documentation,
        2
      );
      expect(result.breakdown.performance).toBeCloseTo(
        85 * DEFAULT_WEIGHTS.performance,
        2
      );
      expect(result.breakdown.security).toBeCloseTo(
        95 * DEFAULT_WEIGHTS.security,
        2
      );
    });
  });

  describe('calculatePercentageDifference', () => {
    it('should calculate percentage improvement correctly', () => {
      const before = {
        totalScore: 50,
        breakdown: { codeQuality: 0, testCoverage: 0, documentation: 0, performance: 0, security: 0 },
        rank: 'bronze' as const,
      };
      const after = {
        totalScore: 75,
        breakdown: { codeQuality: 0, testCoverage: 0, documentation: 0, performance: 0, security: 0 },
        rank: 'gold' as const,
      };

      const difference = calculator.calculatePercentageDifference(before, after);
      expect(difference).toBe(50); // (75 - 50) / 50 * 100 = 50%
    });

    it('should return 100% if before score is 0', () => {
      const before = {
        totalScore: 0,
        breakdown: { codeQuality: 0, testCoverage: 0, documentation: 0, performance: 0, security: 0 },
        rank: 'bronze' as const,
      };
      const after = {
        totalScore: 50,
        breakdown: { codeQuality: 0, testCoverage: 0, documentation: 0, performance: 0, security: 0 },
        rank: 'bronze' as const,
      };

      const difference = calculator.calculatePercentageDifference(before, after);
      expect(difference).toBe(100);
    });
  });
});
