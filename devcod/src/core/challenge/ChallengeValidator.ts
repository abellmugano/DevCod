import { Challenge, ChallengeValidationResult } from './types';

export class ChallengeValidator {
  validate(challenge: Challenge): ChallengeValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate required fields
    if (!challenge.title || challenge.title.trim().length === 0) {
      errors.push('Title is required');
    }

    if (!challenge.description || challenge.description.trim().length === 0) {
      errors.push('Description is required');
    }

    if (!challenge.difficulty) {
      errors.push('Difficulty is required');
    } else if (!['easy', 'medium', 'hard'].includes(challenge.difficulty)) {
      errors.push('Difficulty must be easy, medium, or hard');
    }

    if (!Array.isArray(challenge.requirements) || challenge.requirements.length === 0) {
      errors.push('At least one requirement is required');
    }

    if (!challenge.deadline) {
      errors.push('Deadline is required');
    } else if (challenge.deadline < new Date()) {
      errors.push('Deadline must be in the future');
    }

    if (!challenge.reward || challenge.reward <= 0) {
      errors.push('Reward must be a positive number');
    }

    // Validate status transitions
    const validStatuses = ['open', 'in_progress', 'completed', 'cancelled'];
    if (challenge.status && !validStatuses.includes(challenge.status)) {
      errors.push(`Invalid status: ${challenge.status}`);
    }

    // Warnings
    if (challenge.title && challenge.title.length > 100) {
      warnings.push('Title is longer than 100 characters');
    }

    if (challenge.description && challenge.description.length > 5000) {
      warnings.push('Description is longer than 5000 characters');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  canTransitionStatus(currentStatus: string, newStatus: string): boolean {
    const validTransitions: Record<string, string[]> = {
      open: ['in_progress', 'cancelled'],
      in_progress: ['completed', 'cancelled'],
      completed: [],
      cancelled: [],
    };

    return validTransitions[currentStatus]?.includes(newStatus) ?? false;
  }
}
