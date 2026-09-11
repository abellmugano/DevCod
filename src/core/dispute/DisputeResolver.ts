import { DisputeInput, DisputeVote, DisputeResult, VoteOption, Dispute, DisputeError } from './types.ts';

export const DISPUTE_CONSTANTS = {
  QUORUM_REQUIRED: 2,
  COMMITTEE_SIZE: 3,
  DEADLINE_DAYS: 7,
  MIN_JUSTIFICATION_LENGTH: 50,
} as const;

export class DisputeResolver {
  create(input: DisputeInput): DisputeResult {
    if (input.committee.length !== DISPUTE_CONSTANTS.COMMITTEE_SIZE) {
      return { success: false, error: { code: 'INVALID_COMMITTEE', message: 'Comitê deve ter exatamente 3 membros' } };
    }
    const roles = input.committee.map(m => m.role).sort();
    const expectedRoles = ['community_lancer', 'external_maintainer', 'platform'].sort();
    if (JSON.stringify(roles) !== JSON.stringify(expectedRoles)) {
      return { success: false, error: { code: 'INVALID_COMMITTEE', message: 'Comitê deve conter 1 platform, 1 external_maintainer e 1 community_lancer' } };
    }

    const createdAtMs = new Date(input.createdAt).getTime();
    const deadlineAtMs = new Date(input.deadlineAt).getTime();
    const diffDays = (deadlineAtMs - createdAtMs) / (1000 * 60 * 60 * 24);
    if (diffDays !== DISPUTE_CONSTANTS.DEADLINE_DAYS) {
      return { success: false, error: { code: 'INVALID_DEADLINE', message: 'O prazo deve ser exatamente 7 dias' } };
    }

    const prRegex = /^https:\/\/github\.com\/[\w-]+\/[\w-]+\/pull\/\d+$/i;
    if (!prRegex.test(input.prUrl)) {
      return { success: false, error: { code: 'INVALID_REFERENCE', field: 'prUrl', message: 'URL do PR inválida' } };
    }

    if (input.reason.length < DISPUTE_CONSTANTS.MIN_JUSTIFICATION_LENGTH) {
      return { success: false, error: { code: 'INVALID_INPUT', field: 'reason', message: 'Motivo deve ter >= 50 caracteres' } };
    }

    return { 
      success: true, 
      dispute: {
        disputeId: input.disputeId,
        status: 'pending',
        committee: input.committee, // 🟢 ARMAZENADO PARA VALIDAÇÃO FUTURA
        votes: [],
        decision: null,
        resolvedAt: null,
        escalatedAt: null,
        createdAt: input.createdAt,
        deadlineAt: input.deadlineAt,
      }
    };
  }

  addVote(dispute: Dispute, vote: DisputeVote, context: { challengerId: string; challengedId: string }): DisputeResult {
    if (dispute.status === 'resolved') return { success: false, error: { code: 'ALREADY_RESOLVED', message: 'Já resolvida' } };
    if (dispute.status === 'escalated') return { success: false, error: { code: 'ALREADY_ESCALATED', message: 'Já escalonada' } };
    if (dispute.status === 'expired') return { success: false, error: { code: 'ALREADY_EXPIRED', message: 'Expirada' } };

    if (dispute.votes.some(v => v.voterId === vote.voterId)) {
      return { success: false, error: { code: 'DUPLICATE_VOTE', field: 'voterId', message: 'Voto duplicado' } };
    }

    // 🟢 CORREÇÃO CRÍTICA: Validação estrita no Core
    if (!dispute.committee.some(member => member.userId === vote.voterId)) {
      return { success: false, error: { code: 'INVALID_VOTER', message: 'Votante não é membro do comitê' } };
    }

    if (vote.voterId === context.challengerId || vote.voterId === context.challengedId) {
      return { success: false, error: { code: 'CONFLICT_OF_INTEREST', message: 'Conflito de interesse' } };
    }

    if (vote.justification.length < DISPUTE_CONSTANTS.MIN_JUSTIFICATION_LENGTH) {
      return { success: false, error: { code: 'INVALID_JUSTIFICATION', field: 'justification', message: 'Justificativa >= 50 chars' } };
    }

    const novosVotos = [...dispute.votes, vote];

    if (novosVotos.length >= DISPUTE_CONSTANTS.QUORUM_REQUIRED) {
      const approveCount = novosVotos.filter(v => v.option === 'approve').length;
      const rejectCount = novosVotos.filter(v => v.option === 'reject').length;

      if (approveCount >= DISPUTE_CONSTANTS.QUORUM_REQUIRED) {
        return { success: true, dispute: { ...dispute, votes: novosVotos, status: 'resolved', decision: 'approve', resolvedAt: vote.votedAt } };
      }
      if (rejectCount >= DISPUTE_CONSTANTS.QUORUM_REQUIRED) {
        return { success: true, dispute: { ...dispute, votes: novosVotos, status: 'resolved', decision: 'reject', resolvedAt: vote.votedAt } };
      }
    }

    return { success: true, dispute: { ...dispute, votes: novosVotos } };
  }

  checkExpiration(dispute: Dispute, now: string): DisputeResult {
    if (dispute.status !== 'pending') return { success: true, dispute };
    if (new Date(now).getTime() > new Date(dispute.deadlineAt).getTime()) {
      return { success: true, dispute: { ...dispute, status: 'escalated', escalatedAt: now } };
    }
    return { success: true, dispute };
  }

  getDecision(dispute: Dispute): VoteOption | null {
    if (dispute.votes.length < DISPUTE_CONSTANTS.QUORUM_REQUIRED) return null;
    const approveCount = dispute.votes.filter(v => v.option === 'approve').length;
    const rejectCount = dispute.votes.filter(v => v.option === 'reject').length;
    if (approveCount >= DISPUTE_CONSTANTS.QUORUM_REQUIRED) return 'approve';
    if (rejectCount >= DISPUTE_CONSTANTS.QUORUM_REQUIRED) return 'reject';
    return null;
  }
}
