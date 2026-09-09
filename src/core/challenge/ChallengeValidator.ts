import { ChallengeInput, ValidationResult, ValidationError, ErrorCode } from './types';

export class ChallengeValidator {
  validate(input: ChallengeInput): ValidationResult {
    const errors: ValidationError[] = [];

    // 1. Campos obrigatórios
    if (!input.title || input.title.trim().length < 5) {
      errors.push({ field: 'title', code: ErrorCode.REQUIRED_FIELD, message: 'Título deve ter pelo menos 5 caracteres' });
    }
    if (!input.description || input.description.trim().length === 0) {
      errors.push({ field: 'description', code: ErrorCode.REQUIRED_FIELD, message: 'Descrição é obrigatória' });
    }

    // 2. URL do repositório
    const githubRepoRegex = /^https:\/\/github\.com\/[\w-]+\/[\w-]+\/?$/i;
    if (!githubRepoRegex.test(input.repositoryUrl)) {
      errors.push({ field: 'repositoryUrl', code: ErrorCode.INVALID_FORMAT, message: 'URL deve ser um repositório GitHub válido' });
    }

    // 3. Recompensa e prazo
    if (input.rewardAmount <= 0) {
      errors.push({ field: 'rewardAmount', code: ErrorCode.MINIMUM_VALUE, message: 'Recompensa deve ser maior que zero (em centavos)' });
    }
    if (input.deadlineDays < 1) {
      errors.push({ field: 'deadlineDays', code: ErrorCode.MINIMUM_VALUE, message: 'Prazo deve ser de pelo menos 1 dia' });
    } else if (input.deadlineDays > 180) {
      errors.push({ field: 'deadlineDays', code: ErrorCode.MAXIMUM_VALUE, message: 'Prazo não pode exceder 180 dias' });
    }

    // 4. Pesos (delegação)
    const weightResult = this.validateWeights(input.weights);
    errors.push(...weightResult.errors);

    return { valid: errors.length === 0, errors };
  }

  validateWeights(weights: ChallengeInput['weights']): ValidationResult {
    const errors: ValidationError[] = [];
    const MINIMOS = { functionality: 30, quality: 20, documentation: 10, security: 10 };

    for (const [field, min] of Object.entries(MINIMOS) as [keyof typeof MINIMOS, number][]) {
      if (typeof weights[field] !== 'number' || Number.isNaN(weights[field])) {
        errors.push({ field: `weights.${field}`, code: ErrorCode.INVALID_TYPE, message: `O peso de ${field} deve ser um número` });
      } else if (weights[field] < min) {
        errors.push({ field: `weights.${field}`, code: ErrorCode.MINIMUM_VALUE, message: `O peso de ${field} deve ser no mínimo ${min}%` });
      }
    }

    const sum = weights.functionality + weights.quality + weights.documentation + weights.security;
    if (sum !== 100) {
      errors.push({ field: 'weights', code: ErrorCode.INVALID_SUM, message: `A soma dos pesos deve ser exatamente 100 (atual: ${sum})` });
    }

    return { valid: errors.length === 0, errors };
  }
}
