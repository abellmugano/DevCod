import { Dispute, DisputeOutcome, DisputeResolution } from './types';

export class DisputeResolver {
  private activeDisputes: Map<string, Dispute> = new Map();

  submitDispute(dispute: Dispute): void {
    if (dispute.status !== 'pending') {
      throw new Error('New disputes must have pending status');
    }
    this.activeDisputes.set(dispute.id, dispute);
  }

  escalateDispute(disputeId: string): void {
    const dispute = this.activeDisputes.get(disputeId);
    if (!dispute) {
      throw new Error(`Dispute ${disputeId} not found`);
    }
    if (dispute.status === 'resolved') {
      throw new Error('Cannot escalate a resolved dispute');
    }
    dispute.status = 'escalated';
  }

  updateStatus(disputeId: string, status: Dispute['status']): void {
    const dispute = this.activeDisputes.get(disputeId);
    if (!dispute) {
      throw new Error(`Dispute ${disputeId} not found`);
    }
    dispute.status = status;
  }

  resolveDispute(
    disputeId: string,
    resolution: DisputeResolution
  ): DisputeOutcome {
    const dispute = this.activeDisputes.get(disputeId);
    if (!dispute) {
      throw new Error(`Dispute ${disputeId} not found`);
    }

    if (dispute.status === 'resolved') {
      throw new Error('Dispute already resolved');
    }

    dispute.resolution = resolution;
    dispute.resolvedAt = resolution.resolvedAt;
    dispute.status = 'resolved';

    const outcome: DisputeOutcome = {
      disputeId,
      resolved: true,
      winner: resolution.decision === 'accepted' ? 'submitter' : 'reviewer',
      scoreAdjustment: resolution.decision === 'accepted' ? 10 : -5,
      notes: resolution.reasoning,
    };

    return outcome;
  }

  getDispute(disputeId: string): Dispute | undefined {
    return this.activeDisputes.get(disputeId);
  }

  getActiveDisputes(): Dispute[] {
    return Array.from(this.activeDisputes.values()).filter(
      (d) => d.status !== 'resolved'
    );
  }

  canResolve(dispute: Dispute): boolean {
    return (
      dispute.status === 'under_review' || dispute.status === 'escalated'
    );
  }
}
