export interface Dispute {
  id: string;
  challengeId: string;
  submissionId: string;
  submittedBy: string;
  reason: string;
  description: string;
  evidence: string[];
  status: 'pending' | 'under_review' | 'resolved' | 'escalated';
  createdAt: Date;
  resolvedAt?: Date;
  resolution?: DisputeResolution;
}

export interface DisputeResolution {
  decidedBy: string;
  decision: 'accepted' | 'rejected';
  reasoning: string;
  resolvedAt: Date;
}

export interface DisputeOutcome {
  disputeId: string;
  resolved: boolean;
  winner: 'submitter' | 'reviewer' | null;
  scoreAdjustment?: number;
  notes: string;
}
