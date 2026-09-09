export interface ChallengeWeights {
  functionality: number;
  quality: number;
  documentation: number;
  security: number;
}

export interface ChallengeInput {
  title: string;
  repositoryUrl: string;
  rewardAmount: number;
  deadlineDays: number;
  weights: ChallengeWeights;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
