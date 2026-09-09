export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  requirements: string[];
  deadline: Date;
  reward: number;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
}

export interface Submission {
  id: string;
  challengeId: string;
  userId: string;
  repositoryUrl: string;
  submittedAt: Date;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface ChallengeValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
