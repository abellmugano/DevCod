export interface ChallengeWeights {
  functionality: number;  // Mínimo 30%
  quality: number;        // Mínimo 20%
  documentation: number;  // Mínimo 10%
  security: number;       // Mínimo 10%
}

export interface ChallengeInput {
  title: string;
  description: string;
  weights: ChallengeWeights;
  rewardAmount: number;       // Em centavos
  deadlineDays: number;
  repositoryUrl: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  code: ErrorCode;
  message: string;
}

export enum ErrorCode {
  REQUIRED_FIELD = 'REQUIRED_FIELD',
  MINIMUM_VALUE = 'MINIMUM_VALUE',
  MAXIMUM_VALUE = 'MAXIMUM_VALUE',
  INVALID_SUM = 'INVALID_SUM',
  INVALID_TYPE = 'INVALID_TYPE',
  INVALID_FORMAT = 'INVALID_FORMAT',
}
