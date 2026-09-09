import {
  DisputeInput,
  Dispute,
  DisputeVote,
  DisputeContext,
  DisputeDecision,
  ValidationResult,
  CommitteeRole,
  VoteChoice,
} from './types';

/**
 * Constantes centralizadas para o módulo de Dispute
 */
const DISPUTE_CONSTANTS = {
  COMMITTEE_SIZE: 3,
  QUORUM: 2,
  DEADLINE_DAYS: 7,
  MIN_JUSTIFICATION_LENGTH: 50,
  VALID_ROLES: ['platform', 'external_maintainer', 'community_lancer'] as CommitteeRole[],
  VERSION: 'dispute_v1',
} as const;

/**
 * Máquina de estados para resolução de disputas
 * Estados: pending → resolved | escalated | expired
 */
export class DisputeResolver {
  /**
   * Cria uma nova disputa com validação completa
   */
  create(input: DisputeInput): { dispute: Dispute | null; errors: string[] } {
    const errors: string[] = [];

    // Validar comitê (deve ter exatamente 3 membros com roles únicos)
    if (input.committeeRoles.length !== DISPUTE_CONSTANTS.COMMITTEE_SIZE) {
      errors.push(`Comitê deve ter exatamente ${DISPUTE_CONSTANTS.COMMITTEE_SIZE} membros`);
    }

    // Verificar roles duplicadas
    const uniqueRoles = new Set(input.committeeRoles);
    if (uniqueRoles.size !== input.committeeRoles.length) {
      errors.push('Comitê não pode ter roles duplicadas');
    }

    // Validar roles válidas
    for (const role of input.committeeRoles) {
      if (!DISPUTE_CONSTANTS.VALID_ROLES.includes(role)) {
        errors.push(`Role '${role}' não é válida. Roles válidas: ${DISPUTE_CONSTANTS.VALID_ROLES.join(', ')}`);
      }
    }

    // Validar prazo (deve ser igual ao constante de 7 dias)
    if (input.deadlineDays !== DISPUTE_CONSTANTS.DEADLINE_DAYS) {
      errors.push(`Prazo da disputa deve ser exatamente ${DISPUTE_CONSTANTS.DEADLINE_DAYS} dias`);
    }

    // Validar URL do PR (regex simples para GitHub)
    const githubPrRegex = /^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\/pull\/\d+$/;
    if (!githubPrRegex.test(input.prUrl)) {
      errors.push('URL do Pull Request deve ser uma URL válida do GitHub (ex: https://github.com/user/repo/pull/123)');
    }

    // Validar justificativa (mínimo 50 caracteres)
    if (!input.reason || input.reason.trim().length < DISPUTE_CONSTANTS.MIN_JUSTIFICATION_LENGTH) {
      errors.push(`Justificativa deve ter no mínimo ${DISPUTE_CONSTANTS.MIN_JUSTIFICATION_LENGTH} caracteres`);
    }

    // Se houver erros, retornar null
    if (errors.length > 0) {
      return { dispute: null, errors };
    }

    // Criar disputa imutável
    const now = new Date();
    const deadlineAt = new Date(now.getTime() + input.deadlineDays * 24 * 60 * 60 * 1000);

    const dispute: Dispute = {
      id: this.generateId(),
      prUrl: input.prUrl,
      status: 'pending',
      committeeRoles: [...input.committeeRoles],
      votes: [],
      reason: input.reason.trim(),
      createdAt: now,
      deadlineAt,
      version: DISPUTE_CONSTANTS.VERSION,
    };

    return { dispute, errors: [] };
  }

  /**
   * Adiciona um voto à disputa com validações
   * Retorna nova instância da disputa (imutabilidade)
   */
  addVote(
    dispute: Dispute,
    vote: { role: CommitteeRole; choice: VoteChoice; justification: string },
    context: DisputeContext
  ): { dispute: Dispute | null; errors: string[] } {
    const errors: string[] = [];

    // Validar se disputa está em estado pendente
    if (dispute.status !== 'pending') {
      errors.push(`Disputa não está mais pendente. Estado atual: ${dispute.status}`);
      return { dispute: null, errors };
    }

    // Validar se o votante faz parte do comitê
    if (!dispute.committeeRoles.includes(vote.role)) {
      errors.push(`Role '${vote.role}' não faz parte do comitê desta disputa`);
      return { dispute: null, errors };
    }

    // Validar conflito de interesse (usuário atual não pode votar se já votou)
    const existingVote = dispute.votes.find((v) => v.role === vote.role);
    if (existingVote) {
      errors.push(`Role '${vote.role}' já votou nesta disputa`);
      return { dispute: null, errors };
    }

    // Validar justificativa do voto
    if (!vote.justification || vote.justification.trim().length < DISPUTE_CONSTANTS.MIN_JUSTIFICATION_LENGTH) {
      errors.push(`Justificativa do voto deve ter no mínimo ${DISPUTE_CONSTANTS.MIN_JUSTIFICATION_LENGTH} caracteres`);
      return { dispute: null, errors };
    }

    // Criar novo voto
    const newVote: DisputeVote = {
      role: vote.role,
      choice: vote.choice,
      justification: vote.justification.trim(),
      votedAt: context.now,
    };

    // Criar nova disputa com voto adicionado (imutabilidade)
    const updatedVotes = [...dispute.votes, newVote];
    let newStatus: DisputeStatus = 'pending';

    // Verificar se quorum foi atingido
    if (updatedVotes.length >= DISPUTE_CONSTANTS.QUORUM) {
      newStatus = 'resolved';
    }

    const newDispute: Dispute = {
      ...dispute,
      votes: updatedVotes,
      status: newStatus,
    };

    return { dispute: newDispute, errors: [] };
  }

  /**
   * Verifica se a disputa expirou e escalona se necessário
   * Retorna nova instância da disputa (imutabilidade)
   */
  checkExpiration(dispute: Dispute, now: Date): { dispute: Dispute; escalated: boolean } {
    // Se já estiver resolvida ou escalonada, não faz nada
    if (dispute.status === 'resolved' || dispute.status === 'escalated') {
      return { dispute, escalated: false };
    }

    // Verificar se passou do prazo
    if (now > dispute.deadlineAt) {
      const expiredDispute: Dispute = {
        ...dispute,
        status: 'escalated',
      };
      return { dispute: expiredDispute, escalated: true };
    }

    return { dispute, escalated: false };
  }

  /**
   * Obtém a decisão da disputa baseada nos votos
   * Requer quorum (2 votos) para retornar decisão
   */
  getDecision(dispute: Dispute): DisputeDecision {
    const approveCount = dispute.votes.filter((v) => v.choice === 'approve').length;
    const rejectCount = dispute.votes.filter((v) => v.choice === 'reject').length;
    const totalVotes = dispute.votes.length;

    // Verificar se quorum foi atingido
    const quorumReached = totalVotes >= DISPUTE_CONSTANTS.QUORUM;

    // Se não há quorum, retorna null
    if (!quorumReached) {
      return {
        decision: null,
        quorumReached: false,
        voteCount: { approve: approveCount, reject: rejectCount },
        version: DISPUTE_CONSTANTS.VERSION,
      };
    }

    // Decisão por maioria
    let decision: 'approve' | 'reject' | null = null;
    if (approveCount > rejectCount) {
      decision = 'approve';
    } else if (rejectCount > approveCount) {
      decision = 'reject';
    } else {
      // Empate com quorum - não há decisão clara
      decision = null;
    }

    return {
      decision,
      quorumReached: true,
      voteCount: { approve: approveCount, reject: rejectCount },
      version: DISPUTE_CONSTANTS.VERSION,
    };
  }

  /**
   * Gera um ID único para a disputa (simples, sem dependências externas)
   */
  private generateId(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 8);
    return `dispute_${timestamp}_${randomPart}`;
  }
}
