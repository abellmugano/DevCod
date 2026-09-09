export type DisputeStatus = 'pending' | 'resolved' | 'escalated' | 'expired';
export type VoteOption = 'approve' | 'reject';
export type CommitteeRole = 'platform' | 'external_maintainer' | 'community_lancer';

export interface CommitteeMember {
  userId: string;
  role: CommitteeRole;
}

export interface DisputeVote {
  voterId: string;
  role: CommitteeRole;
  option: VoteOption;
  justification: string;
  votedAt: string;
}

export interface DisputeInput {
  disputeId: string;
  challengerId: string;
  challengedId: string;
  challengeId: string;
  prUrl: string;
  originalScore: number;
  contestedScore: number;
  reason: string;
  createdAt: string;
  deadlineAt: string;
  committee: CommitteeMember[];
}

export interface Dispute {
  disputeId: string;
  status: DisputeStatus;
  committee: CommitteeMember[]; // 🟢 ADICIONADO: Essencial para validação no Core
  votes: DisputeVote[];
  decision: VoteOption | null;
  resolvedAt: string | null;
  escalatedAt: string | null;
  createdAt: string;
  deadlineAt: string;
}

export type DisputeResult =
  | { success: true; dispute: Dispute }
  | { success: false; error: DisputeError };

export interface DisputeError {
  code: DisputeErrorCode;
  field?: string;
  message: string;
}

export type DisputeErrorCode =
  | 'ALREADY_RESOLVED'
  | 'ALREADY_ESCALATED'
  | 'ALREADY_EXPIRED'
  | 'INVALID_REFERENCE'
  | 'INVALID_VOTER'
  | 'DUPLICATE_VOTE'
  | 'CONFLICT_OF_INTEREST'
  | 'INVALID_JUSTIFICATION'
  | 'INVALID_COMMITTEE'
  | 'INVALID_DEADLINE'
  | 'INVALID_INPUT';
