import { ChallengeInput, ValidationResult, ChallengeWeights } from './types';

export class ChallengeValidator {
  private static readonly MIN_FUNCTIONALITY = 30;
  private static readonly MIN_QUALITY = 20;
  private static readonly MIN_DOCUMENTATION = 10;
  private static readonly MIN_SECURITY = 10;
  private static readonly TOTAL_WEIGHTS = 100;
  private static readonly MIN_REWARD = 1;
  private static readonly MIN_DEADLINE_DAYS = 1;
  private static readonly MAX_DEADLINE_DAYS = 180;
  private static readonly MIN_TITLE_LENGTH = 5;
  private static readonly GITHUB_REPO_REGEX = /^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+(\/)?$/;

  /**
   * Valida todos os campos de um desafio e retorna todos os erros encontrados.
   * Não usa early-exit, async/await ou throw.
   */
  public validate(input: ChallengeInput): ValidationResult {
    const errors: string[] = [];

    // Validar título
    if (!input.title || input.title.trim().length < this.MIN_TITLE_LENGTH) {
      errors.push(`Title must have at least ${this.MIN_TITLE_LENGTH} characters`);
    }

    // Validar URL do repositório GitHub
    if (!input.repositoryUrl || !this.GITHUB_REPO_REGEX.test(input.repositoryUrl)) {
      errors.push('Repository URL must be a valid GitHub repository URL');
    }

    // Validar recompensa (em centavos, deve ser > 0)
    if (typeof input.rewardAmount !== 'number' || input.rewardAmount < this.MIN_REWARD) {
      errors.push(`Reward amount must be greater than 0 cents`);
    }

    // Validar prazo (deadlineDays entre 1 e 180 dias)
    if (
      typeof input.deadlineDays !== 'number' ||
      input.deadlineDays < this.MIN_DEADLINE_DAYS ||
      input.deadlineDays > this.MAX_DEADLINE_DAYS
    ) {
      errors.push(`Deadline must be between ${this.MIN_DEADLINE_DAYS} and ${this.MAX_DEADLINE_DAYS} days`);
    }

    // Validar pesos
    const weightErrors = this.validateWeights(input.weights);
    errors.push(...weightErrors);

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Valida apenas os pesos do desafio.
   * - Cada peso deve respeitar o mínimo definido
   * - A soma dos pesos deve ser exatamente 100
   */
  public validateWeights(weights: ChallengeWeights): string[] {
    const errors: string[] = [];

    if (!weights) {
      errors.push('Weights are required');
      return errors;
    }

    // Validar peso mínimo de functionality
    if (typeof weights.functionality !== 'number' || weights.functionality < this.MIN_FUNCTIONALITY) {
      errors.push(`Functionality weight must be at least ${this.MIN_FUNCTIONALITY}`);
    }

    // Validar peso mínimo de quality
    if (typeof weights.quality !== 'number' || weights.quality < this.MIN_QUALITY) {
      errors.push(`Quality weight must be at least ${this.MIN_QUALITY}`);
    }

    // Validar peso mínimo de documentation
    if (typeof weights.documentation !== 'number' || weights.documentation < this.MIN_DOCUMENTATION) {
      errors.push(`Documentation weight must be at least ${this.MIN_DOCUMENTATION}`);
    }

    // Validar peso mínimo de security
    if (typeof weights.security !== 'number' || weights.security < this.MIN_SECURITY) {
      errors.push(`Security weight must be at least ${this.MIN_SECURITY}`);
    }

    // Validar soma dos pesos = 100
    const totalWeight =
      (weights.functionality || 0) +
      (weights.quality || 0) +
      (weights.documentation || 0) +
      (weights.security || 0);

    if (totalWeight !== this.TOTAL_WEIGHTS) {
      errors.push(`Sum of weights must be exactly ${this.TOTAL_WEIGHTS}, got ${totalWeight}`);
    }

    return errors;
  }
}
