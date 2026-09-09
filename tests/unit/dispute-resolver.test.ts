import { DisputeResolver } from '../../src/core/dispute/DisputeResolver';
import type {
  DisputeInput,
  DisputeVote,
  DisputeContext,
  Dispute,
} from '../../src/core/dispute/types';

describe('DisputeResolver', () => {
  let resolver: DisputeResolver;

  beforeEach(() => {
    resolver = new DisputeResolver();
  });

  const createValidInput = (): DisputeInput => ({
    challengeId: 'challenge-123',
    pullRequestUrl: 'https://github.com/devcod/repo/pull/42',
    reason: 'The submission was unfairly rejected due to a misunderstanding of the requirements.',
    deadlineDays: 7,
  });

  const createValidContext = (voterRole: string): DisputeContext => ({
    voterRole,
    justification: 'This is a detailed justification explaining why I voted this way based on the evidence provided.',
  });

  describe('create', () => {
    it('should create a valid dispute with pending status', () => {
      const input = createValidInput();
      const result = resolver.create(input);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.dispute?.status).toBe('pending');
      expect(result.dispute?.challengeId).toBe(input.challengeId);
      expect(result.dispute?.pullRequestUrl).toBe(input.pullRequestUrl);
      expect(result.dispute?.votes).toEqual([]);
    });

    it('should return error when committee has less than 3 members', () => {
      const input = createValidInput();
      input.committee = ['platform', 'external_maintainer'];
      const result = resolver.create(input);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Committee'))).toBe(true);
    });

    it('should return error when deadline is not 7 days', () => {
      const input = createValidInput();
      input.deadlineDays = 5;
      const result = resolver.create(input);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('deadline'))).toBe(true);
    });

    it('should return error when PR URL is invalid', () => {
      const input = createValidInput();
      input.pullRequestUrl = 'https://gitlab.com/repo/merge/42';
      const result = resolver.create(input);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('GitHub'))).toBe(true);
    });

    it('should return error when reason has less than 50 characters', () => {
      const input = createValidInput();
      input.reason = 'Too short';
      const result = resolver.create(input);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('50'))).toBe(true);
    });

    it('should return all errors at once without early exit', () => {
      const input: DisputeInput = {
        challengeId: 'ch-1',
        pullRequestUrl: 'invalid-url',
        reason: 'Short',
        deadlineDays: 3,
        committee: ['platform'],
      };
      const result = resolver.create(input);
      expect(result.errors.length).toBeGreaterThan(1);
      expect(result.valid).toBe(false);
    });

    it('should initialize votes as empty array', () => {
      const input = createValidInput();
      const result = resolver.create(input);
      expect(result.dispute?.votes).toEqual([]);
      expect(result.dispute?.createdAt).toBeDefined();
    });
  });

  describe('addVote', () => {
    it('should add a valid vote to a pending dispute', () => {
      const createResult = resolver.create(createValidInput());
      const dispute = createResult.dispute!;
      const context = createValidContext('platform');

      const voteResult = resolver.addVote(dispute, 'approve', context);
      expect(voteResult.valid).toBe(true);
      expect(voteResult.errors).toHaveLength(0);
      expect(voteResult.dispute?.votes).toHaveLength(1);
      expect(voteResult.dispute?.votes[0].role).toBe('platform');
      expect(voteResult.dispute?.votes[0].choice).toBe('approve');
    });

    it('should prevent duplicate votes from same role', () => {
      const createResult = resolver.create(createValidInput());
      const dispute = createResult.dispute!;
      const context = createValidContext('platform');

      const firstVote = resolver.addVote(dispute, 'approve', context);
      const secondVote = resolver.addVote(firstVote.dispute!, 'reject', context);

      expect(secondVote.valid).toBe(false);
      expect(secondVote.errors.some(e => e.includes('duplicate') || e.includes('already'))).toBe(true);
    });

    it('should detect conflict of interest (voter role not in committee)', () => {
      const createResult = resolver.create(createValidInput());
      const dispute = createResult.dispute!;
      const context = createValidContext('unauthorized_member');

      const voteResult = resolver.addVote(dispute, 'approve', context);
      expect(voteResult.valid).toBe(false);
      expect(voteResult.errors.some(e => e.includes('committee') || e.includes('Conflict'))).toBe(true);
    });

    it('should resolve dispute when quorum is reached (2 votes)', () => {
      const createResult = resolver.create(createValidInput());
      let dispute = createResult.dispute!;

      const vote1 = resolver.addVote(dispute, 'approve', createValidContext('platform'));
      dispute = vote1.dispute!;

      const vote2 = resolver.addVote(dispute, 'approve', createValidContext('external_maintainer'));
      
      expect(vote2.valid).toBe(true);
      expect(vote2.dispute?.status).toBe('resolved');
      expect(vote2.dispute?.votes).toHaveLength(2);
    });

    it('should maintain immutability (return new object)', () => {
      const createResult = resolver.create(createValidInput());
      const originalDispute = createResult.dispute!;
      const context = createValidContext('platform');

      const voteResult = resolver.addVote(originalDispute, 'approve', context);
      
      expect(originalDispute.votes).toHaveLength(0);
      expect(voteResult.dispute?.votes).toHaveLength(1);
      expect(originalDispute).not.toBe(voteResult.dispute);
    });

    it('should not allow voting on resolved dispute', () => {
      const createResult = resolver.create(createValidInput());
      let dispute = createResult.dispute!;

      dispute = resolver.addVote(dispute, 'approve', createValidContext('platform')).dispute!;
      dispute = resolver.addVote(dispute, 'approve', createValidContext('external_maintainer')).dispute!;

      const voteResult = resolver.addVote(dispute, 'reject', createValidContext('community_lancer'));
      expect(voteResult.valid).toBe(false);
      expect(voteResult.errors.some(e => e.includes('resolved') || e.includes('status'))).toBe(true);
    });

    it('should not allow voting on escalated dispute', () => {
      const createResult = resolver.create(createValidInput());
      let dispute = createResult.dispute!;
      dispute = { ...dispute, status: 'escalated' };

      const voteResult = resolver.addVote(dispute, 'approve', createValidContext('platform'));
      expect(voteResult.valid).toBe(false);
    });

    it('should not allow voting on expired dispute', () => {
      const createResult = resolver.create(createValidInput());
      let dispute = createResult.dispute!;
      dispute = { ...dispute, status: 'expired' };

      const voteResult = resolver.addVote(dispute, 'approve', createValidContext('platform'));
      expect(voteResult.valid).toBe(false);
    });
  });

  describe('checkExpiration', () => {
    it('should keep dispute pending if within 7 days', () => {
      const createResult = resolver.create(createValidInput());
      const dispute = createResult.dispute!;
      
      const now = new Date(dispute.createdAt!.getTime() + 6 * 24 * 60 * 60 * 1000);
      const result = resolver.checkExpiration(dispute, now);

      expect(result.dispute?.status).toBe('pending');
    });

    it('should escalate dispute if more than 7 days have passed', () => {
      const createResult = resolver.create(createValidInput());
      const dispute = createResult.dispute!;
      
      const now = new Date(dispute.createdAt!.getTime() + 8 * 24 * 60 * 60 * 1000);
      const result = resolver.checkExpiration(dispute, now);

      expect(result.dispute?.status).toBe('escalated');
    });

    it('should not modify already resolved disputes', () => {
      const createResult = resolver.create(createValidInput());
      let dispute = createResult.dispute!;
      dispute = { ...dispute, status: 'resolved' };
      
      const now = new Date(dispute.createdAt!.getTime() + 10 * 24 * 60 * 60 * 1000);
      const result = resolver.checkExpiration(dispute, now);

      expect(result.dispute?.status).toBe('resolved');
    });

    it('should not modify already escalated disputes', () => {
      const createResult = resolver.create(createValidInput());
      let dispute = createResult.dispute!;
      dispute = { ...dispute, status: 'escalated' };
      
      const now = new Date(dispute.createdAt!.getTime() + 10 * 24 * 60 * 60 * 1000);
      const result = resolver.checkExpiration(dispute, now);

      expect(result.dispute?.status).toBe('escalated');
    });

    it('should maintain immutability (return new object)', () => {
      const createResult = resolver.create(createValidInput());
      const originalDispute = createResult.dispute!;
      
      const now = new Date(originalDispute.createdAt!.getTime() + 10 * 24 * 60 * 60 * 1000);
      const result = resolver.checkExpiration(originalDispute, now);

      expect(originalDispute.status).toBe('pending');
      expect(result.dispute?.status).toBe('escalated');
      expect(originalDispute).not.toBe(result.dispute);
    });
  });

  describe('getDecision', () => {
    it('should return null for pending dispute', () => {
      const createResult = resolver.create(createValidInput());
      const dispute = createResult.dispute!;
      
      const decision = resolver.getDecision(dispute);
      expect(decision).toBeNull();
    });

    it('should return approve when majority votes approve', () => {
      const createResult = resolver.create(createValidInput());
      let dispute = createResult.dispute!;

      dispute = resolver.addVote(dispute, 'approve', createValidContext('platform')).dispute!;
      dispute = resolver.addVote(dispute, 'approve', createValidContext('external_maintainer')).dispute!;

      const decision = resolver.getDecision(dispute);
      expect(decision).toBe('approve');
    });

    it('should return reject when majority votes reject', () => {
      const createResult = resolver.create(createValidInput());
      let dispute = createResult.dispute!;

      dispute = resolver.addVote(dispute, 'reject', createValidContext('platform')).dispute!;
      dispute = resolver.addVote(dispute, 'reject', createValidContext('community_lancer')).dispute!;

      const decision = resolver.getDecision(dispute);
      expect(decision).toBe('reject');
    });

    it('should return null for escalated dispute', () => {
      const createResult = resolver.create(createValidInput());
      let dispute = createResult.dispute!;
      dispute = { ...dispute, status: 'escalated' };

      const decision = resolver.getDecision(dispute);
      expect(decision).toBeNull();
    });

    it('should return null for expired dispute', () => {
      const createResult = resolver.create(createValidInput());
      let dispute = createResult.dispute!;
      dispute = { ...dispute, status: 'expired' };

      const decision = resolver.getDecision(dispute);
      expect(decision).toBeNull();
    });
  });
});
