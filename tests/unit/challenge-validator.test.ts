import { ChallengeValidator } from '../../src/core/challenge/ChallengeValidator';
import type { ChallengeInput, ChallengeWeights } from '../../src/core/challenge/types';

describe('ChallengeValidator', () => {
  let validator: ChallengeValidator;

  beforeEach(() => {
    validator = new ChallengeValidator();
  });

  const createValidInput = (): ChallengeInput => ({
    title: 'Implement authentication system',
    repositoryUrl: 'https://github.com/devcod/auth-module',
    rewardAmount: 50000,
    deadlineDays: 30,
    weights: {
      functionality: 40,
      quality: 25,
      documentation: 15,
      security: 20,
    },
  });

  describe('validateWeights', () => {
    it('should return no errors for valid weights summing to 100', () => {
      const weights: ChallengeWeights = {
        functionality: 40,
        quality: 25,
        documentation: 15,
        security: 20,
      };
      const result = validator.validateWeights(weights);
      expect(result.errors).toHaveLength(0);
      expect(result.valid).toBe(true);
    });

    it('should return error when sum is not 100', () => {
      const weights: ChallengeWeights = {
        functionality: 30,
        quality: 20,
        documentation: 10,
        security: 10,
      };
      const result = validator.validateWeights(weights);
      expect(result.errors).toContain('Sum of weights must be exactly 100');
      expect(result.valid).toBe(false);
    });

    it('should return error when functionality < 30', () => {
      const weights: ChallengeWeights = {
        functionality: 25,
        quality: 25,
        documentation: 25,
        security: 25,
      };
      const result = validator.validateWeights(weights);
      expect(result.errors).toContain('Functionality weight must be at least 30');
      expect(result.valid).toBe(false);
    });

    it('should return error when quality < 20', () => {
      const weights: ChallengeWeights = {
        functionality: 40,
        quality: 15,
        documentation: 20,
        security: 25,
      };
      const result = validator.validateWeights(weights);
      expect(result.errors).toContain('Quality weight must be at least 20');
      expect(result.valid).toBe(false);
    });

    it('should return error when documentation < 10', () => {
      const weights: ChallengeWeights = {
        functionality: 45,
        quality: 25,
        documentation: 5,
        security: 25,
      };
      const result = validator.validateWeights(weights);
      expect(result.errors).toContain('Documentation weight must be at least 10');
      expect(result.valid).toBe(false);
    });

    it('should return error when security < 10', () => {
      const weights: ChallengeWeights = {
        functionality: 45,
        quality: 25,
        documentation: 25,
        security: 5,
      };
      const result = validator.validateWeights(weights);
      expect(result.errors).toContain('Security weight must be at least 10');
      expect(result.valid).toBe(false);
    });

    it('should return all weight errors at once', () => {
      const weights: ChallengeWeights = {
        functionality: 10,
        quality: 5,
        documentation: 5,
        security: 5,
      };
      const result = validator.validateWeights(weights);
      expect(result.errors).toContain('Functionality weight must be at least 30');
      expect(result.errors).toContain('Quality weight must be at least 20');
      expect(result.errors).toContain('Documentation weight must be at least 10');
      expect(result.errors).toContain('Security weight must be at least 10');
      expect(result.errors).toContain('Sum of weights must be exactly 100');
      expect(result.valid).toBe(false);
    });
  });

  describe('validate', () => {
    it('should return no errors for valid input', () => {
      const input = createValidInput();
      const result = validator.validate(input);
      expect(result.errors).toHaveLength(0);
      expect(result.valid).toBe(true);
    });

    it('should return error when title has less than 5 characters', () => {
      const input = createValidInput();
      input.title = 'Fix';
      const result = validator.validate(input);
      expect(result.errors).toContain('Title must have at least 5 characters');
      expect(result.valid).toBe(false);
    });

    it('should return error when repository URL is invalid', () => {
      const input = createValidInput();
      input.repositoryUrl = 'https://gitlab.com/repo';
      const result = validator.validate(input);
      expect(result.errors).toContain('Repository URL must be a valid GitHub URL');
      expect(result.valid).toBe(false);
    });

    it('should return error when rewardAmount is zero', () => {
      const input = createValidInput();
      input.rewardAmount = 0;
      const result = validator.validate(input);
      expect(result.errors).toContain('Reward amount must be greater than 0');
      expect(result.valid).toBe(false);
    });

    it('should return error when rewardAmount is negative', () => {
      const input = createValidInput();
      input.rewardAmount = -100;
      const result = validator.validate(input);
      expect(result.errors).toContain('Reward amount must be greater than 0');
      expect(result.valid).toBe(false);
    });

    it('should return error when deadlineDays is less than 1', () => {
      const input = createValidInput();
      input.deadlineDays = 0;
      const result = validator.validate(input);
      expect(result.errors).toContain('Deadline must be between 1 and 180 days');
      expect(result.valid).toBe(false);
    });

    it('should return error when deadlineDays is greater than 180', () => {
      const input = createValidInput();
      input.deadlineDays = 200;
      const result = validator.validate(input);
      expect(result.errors).toContain('Deadline must be between 1 and 180 days');
      expect(result.valid).toBe(false);
    });

    it('should return all errors at once without early exit', () => {
      const input: ChallengeInput = {
        title: 'Ab',
        repositoryUrl: 'invalid-url',
        rewardAmount: -100,
        deadlineDays: 200,
        weights: {
          functionality: 10,
          quality: 5,
          documentation: 5,
          security: 5,
        },
      };
      const result = validator.validate(input);
      expect(result.errors.length).toBeGreaterThan(1);
      expect(result.errors).toContain('Title must have at least 5 characters');
      expect(result.errors).toContain('Repository URL must be a valid GitHub URL');
      expect(result.errors).toContain('Reward amount must be greater than 0');
      expect(result.errors).toContain('Deadline must be between 1 and 180 days');
      expect(result.valid).toBe(false);
    });
  });
});
