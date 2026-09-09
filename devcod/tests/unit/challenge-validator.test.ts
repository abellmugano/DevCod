import { ChallengeValidator } from '../../src/core/challenge/ChallengeValidator';
import { Challenge } from '../../src/core/challenge/types';

describe('ChallengeValidator', () => {
  let validator: ChallengeValidator;

  beforeEach(() => {
    validator = new ChallengeValidator();
  });

  describe('validate', () => {
    it('should return valid result for a complete challenge', () => {
      const challenge: Challenge = {
        id: '1',
        title: 'Test Challenge',
        description: 'A test challenge description',
        difficulty: 'medium',
        requirements: ['Requirement 1', 'Requirement 2'],
        deadline: new Date(Date.now() + 86400000), // Tomorrow
        reward: 100,
        status: 'open',
      };

      const result = validator.validate(challenge);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return errors for missing required fields', () => {
      const challenge: Partial<Challenge> = {
        id: '1',
      };

      const result = validator.validate(challenge as Challenge);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Title is required');
      expect(result.errors).toContain('Description is required');
      expect(result.errors).toContain('Difficulty is required');
      expect(result.errors).toContain('At least one requirement is required');
      expect(result.errors).toContain('Deadline is required');
      expect(result.errors).toContain('Reward must be a positive number');
    });

    it('should return error for invalid difficulty', () => {
      const challenge: Challenge = {
        id: '1',
        title: 'Test',
        description: 'Test desc',
        difficulty: 'extreme' as any,
        requirements: ['Req'],
        deadline: new Date(Date.now() + 86400000),
        reward: 100,
        status: 'open',
      };

      const result = validator.validate(challenge);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Difficulty must be easy, medium, or hard');
    });

    it('should return error for past deadline', () => {
      const challenge: Challenge = {
        id: '1',
        title: 'Test',
        description: 'Test desc',
        difficulty: 'easy',
        requirements: ['Req'],
        deadline: new Date(Date.now() - 86400000), // Yesterday
        reward: 100,
        status: 'open',
      };

      const result = validator.validate(challenge);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Deadline must be in the future');
    });

    it('should return warnings for long fields', () => {
      const challenge: Challenge = {
        id: '1',
        title: 'A'.repeat(101),
        description: 'B'.repeat(5001),
        difficulty: 'easy',
        requirements: ['Req'],
        deadline: new Date(Date.now() + 86400000),
        reward: 100,
        status: 'open',
      };

      const result = validator.validate(challenge);

      expect(result.warnings).toContain('Title is longer than 100 characters');
      expect(result.warnings).toContain('Description is longer than 5000 characters');
    });
  });

  describe('canTransitionStatus', () => {
    it('should allow transition from open to in_progress', () => {
      expect(validator.canTransitionStatus('open', 'in_progress')).toBe(true);
    });

    it('should allow transition from open to cancelled', () => {
      expect(validator.canTransitionStatus('open', 'cancelled')).toBe(true);
    });

    it('should allow transition from in_progress to completed', () => {
      expect(validator.canTransitionStatus('in_progress', 'completed')).toBe(true);
    });

    it('should not allow transition from completed to any status', () => {
      expect(validator.canTransitionStatus('completed', 'open')).toBe(false);
      expect(validator.canTransitionStatus('completed', 'in_progress')).toBe(false);
    });

    it('should not allow transition from cancelled to any status', () => {
      expect(validator.canTransitionStatus('cancelled', 'open')).toBe(false);
    });
  });
});
