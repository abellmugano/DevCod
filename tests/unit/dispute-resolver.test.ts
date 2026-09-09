import { DisputeResolver } from '../../src/core/dispute/DisputeResolver';
import { DisputeInput, DisputeVote, CommitteeMember } from '../../src/core/dispute/types';

describe('DisputeResolver', () => {
  let resolver: DisputeResolver;
  const committee: CommitteeMember[] = [
    { userId: 'platform-1', role: 'platform' },
    { userId: 'maintainer-1', role: 'external_maintainer' },
    { userId: 'lancer-1', role: 'community_lancer' },
  ];
  const validInput: DisputeInput = {
    disputeId: 'd-1', challengerId: 'lancer-c', challengedId: 'maintainer-c',
    challengeId: 'c-1', prUrl: 'https://github.com/a/b/pull/1',
    originalScore: 6.5, contestedScore: 8.5,
    reason: 'A avaliação manual não considerou a complexidade da refatoração realizada nos arquivos de domínio, que exigiu análise profunda.',
    createdAt: '2026-09-01T10:00:00Z', deadlineAt: '2026-09-08T10:00:00Z', committee,
  };

  beforeEach(() => { resolver = new DisputeResolver(); });

  it('deve criar disputa com status pending', () => {
    const { success, dispute } = resolver.create(validInput);
    expect(success).toBe(true);
    expect(dispute!.status).toBe('pending');
    expect(dispute!.committee).toHaveLength(3);
  });

  it('deve rejeitar comitê inválido', () => {
    const { success, error } = resolver.create({ ...validInput, committee: committee.slice(0, 2) });
    expect(success).toBe(false);
    expect(error!.code).toBe('INVALID_COMMITTEE');
  });

  it('deve rejeitar URL de PR inválida', () => {
    const { success, error } = resolver.create({ ...validInput, prUrl: 'https://gitlab.com/x/y' });
    expect(success).toBe(false);
    expect(error!.code).toBe('INVALID_REFERENCE');
  });

  it('deve manter pending após 1 voto', () => {
    const { dispute: created } = resolver.create(validInput);
    const vote: DisputeVote = { voterId: 'platform-1', role: 'platform', option: 'approve', justification: 'A'.repeat(50), votedAt: '2026-09-02T10:00:00Z' };
    const { success, dispute } = resolver.addVote(created!, vote, { challengerId: validInput.challengerId, challengedId: validInput.challengedId });
    expect(success).toBe(true);
    expect(dispute!.status).toBe('pending');
  });

  it('deve resolver com approve ao atingir 2 votos', () => {
    const { dispute: created } = resolver.create(validInput);
    const ctx = { challengerId: validInput.challengerId, challengedId: validInput.challengedId };
    const v1: DisputeVote = { voterId: 'platform-1', role: 'platform', option: 'approve', justification: 'A'.repeat(50), votedAt: '2026-09-02T10:00:00Z' };
    const v2: DisputeVote = { voterId: 'maintainer-1', role: 'external_maintainer', option: 'approve', justification: 'B'.repeat(50), votedAt: '2026-09-03T10:00:00Z' };
    const r1 = resolver.addVote(created!, v1, ctx);
    const r2 = resolver.addVote(r1.dispute!, v2, ctx);
    expect(r2.success).toBe(true);
    expect(r2.dispute!.status).toBe('resolved');
    expect(r2.dispute!.decision).toBe('approve');
  });

  it('deve rejeitar voto duplicado', () => {
    const { dispute: created } = resolver.create(validInput);
    const ctx = { challengerId: validInput.challengerId, challengedId: validInput.challengedId };
    const v: DisputeVote = { voterId: 'platform-1', role: 'platform', option: 'approve', justification: 'A'.repeat(50), votedAt: '2026-09-02T10:00:00Z' };
    resolver.addVote(created!, v, ctx);
    const r2 = resolver.addVote(created!, v, ctx);
    expect(r2.success).toBe(false);
    expect(r2.error!.code).toBe('DUPLICATE_VOTE');
  });

  it('🟢 deve rejeitar votante que não é do comitê (Core Isolado)', () => {
    const { dispute: created } = resolver.create(validInput);
    const ctx = { challengerId: validInput.challengerId, challengedId: validInput.challengedId };
    const v: DisputeVote = { voterId: 'hacker-99', role: 'platform', option: 'approve', justification: 'A'.repeat(50), votedAt: '2026-09-02T10:00:00Z' };
    const r = resolver.addVote(created!, v, ctx);
    expect(r.success).toBe(false);
    expect(r.error!.code).toBe('INVALID_VOTER');
  });

  it('deve rejeitar conflito de interesse', () => {
    const { dispute: created } = resolver.create(validInput);
    const ctx = { challengerId: validInput.challengerId, challengedId: validInput.challengedId };
    const v: DisputeVote = { voterId: validInput.challengerId, role: 'platform', option: 'approve', justification: 'A'.repeat(50), votedAt: '2026-09-02T10:00:00Z' };
    const r = resolver.addVote(created!, v, ctx);
    expect(r.success).toBe(false);
    expect(r.error!.code).toBe('CONFLICT_OF_INTEREST');
  });

  it('deve escalar ao ultrapassar deadline', () => {
    const { dispute: created } = resolver.create(validInput);
    const r = resolver.checkExpiration(created!, '2026-09-09T10:00:00Z');
    expect(r.success).toBe(true);
    expect(r.dispute!.status).toBe('escalated');
  });
});
