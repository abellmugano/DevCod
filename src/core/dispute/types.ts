// Tipos para o módulo de Dispute Resolution

export type DisputeStatus = 'pending' | 'resolved' | 'escalated' | 'expired';

export type CommitteeRole = 'platform' | 'external_maintainer' | 'community_lancer';

export type VoteChoice = 'approve' | 'reject';

export interface DisputeVote {
  role: CommitteeRole;
  choice: VoteChoice;
  justification: string;
  votedAt: Date;
}

export interface DisputeContext {
  currentUserRole?: CommitteeRole;
  now: Date;
}

export interface DisputeInput {
  prUrl: string;
  deadlineDays: number;
  committeeRoles: CommitteeRole[];
  reason: string;
}

export interface Dispute {
  id: string;
  prUrl: string;
  status: DisputeStatus;
  committeeRoles: CommitteeRole[];
  votes: DisputeVote[];
  reason: string;
  createdAt: Date;
  deadlineAt: Date;
  version: string;
}

export interface DisputeDecision {
  decision: 'approve' | 'reject' | null;
  quorumReached: boolean;
  voteCount: { approve: number; reject: number };
  version: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
