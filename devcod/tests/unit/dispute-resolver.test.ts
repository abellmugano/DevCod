import { DisputeResolver } from '../../src/core/dispute/DisputeResolver';
import type {
  DisputeInput,
  DisputeContext,
  CommitteeRole,
  VoteChoice,
} from '../../src/core/dispute/types';

describe('DisputeResolver', () => {
  let resolver: DisputeResolver;

  beforeEach(() => {
    resolver = new DisputeResolver();
  });

  const createValidInput = (): DisputeInput => ({
    prUrl: 'https://github.com/devcod/repo/pull/42',
    deadlineDays: 7,
    committeeRoles: ['platform', 'external_maintainer', 'community_lancer'] as CommitteeRole[],
    committeeMemberIds: ['user-platform', 'user-external', 'user-community'],
    reason: 'The submission was unfairly rejected due to a misunderstanding of the requirements.',
  });

  const createValidContext = (voterId: string): DisputeContext => ({
    challengerId: 'challenger-user',
    challengedId: 'challenged-user',
    now: new Date(),
  });

  const createVote = (
    voterId: string,
    role: CommitteeRole,
    choice: VoteChoice,
    justification: string
  ) => ({
    voterId,
    role,
    choice,
    justification,
  });

  describe('create', () => {
    it('should create a valid dispute with pending status and committee stored', () => {
      const input = createValidInput();
      const result = resolver.create(input);
      expect(result.errors).toHaveLength(0);
      expect(result.dispute?.status).toBe('pending');
      expect(result.dispute?.prUrl).toBe(input.prUrl);
      expect(result.dispute?.committeeRoles).toEqual(input.committeeRoles);
      expect(result.dispute?.committeeMemberIds).toEqual(input.committeeMemberIds);
      expect(result.dispute?.votes).toEqual([]);
    });

    it('should return error when committee has less than 3 members', () => {
      const input = createValidInput();
      input.committeeRoles = ['platform', 'external_maintainer'];
      const result = resolver.create(input);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some((e) => e.includes('Comitê'))).toBe(true);
    });

    it('should return error when committeeMemberIds has wrong size', () => {
      const input = createValidInput();
      input.committeeMemberIds = ['user1', 'user2'];
      const result = resolver.create(input);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some((e) => e.includes('committeeMemberIds'))).toBe(true);
    });

    it('should return error when deadline is not 7 days', () => {
      const input = createValidInput();
      input.deadlineDays = 5;
      const result = resolver.create(input);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some((e) => e.includes('Prazo'))).toBe(true);
    });

    it('should return error when PR URL is invalid', () => {
      const input = createValidInput();
      input.prUrl = 'https://gitlab.com/repo/merge/42';
      const result = resolver.create(input);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some((e) => e.includes('GitHub'))).toBe(true);
    });

    it('should return error when reason has less than 50 characters', () => {
      const input = createValidInput();
      input.reason = 'Too short';
      const result = resolver.create(input);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some((e) => e.includes('50'))).toBe(true);
    });

    it('should return all errors at once without early exit', () => {
      const input: DisputeInput = {
        prUrl: 'invalid-url',
        deadlineDays: 3,
        committeeRoles: ['platform'],
        committeeMemberIds: ['user1'],
        reason: 'Short',
      };
      const result = resolver.create(input);
      expect(result.errors.length).toBeGreaterThan(1);
    });

    it('should store committee member IDs in the dispute object', () => {
      const input = createValidInput();
      const result = resolver.create(input);
      expect(result.dispute?.committeeMemberIds).toEqual(input.committeeMemberIds);
      expect(result.dispute?.committeeMemberIds).toHaveLength(3);
    });
  });

  describe('addVote', () => {
    it('should add a valid vote to a pending dispute', () => {
      const createResult = resolver.create(createValidInput());
      const dispute = createResult.dispute!;
      const context = createValidContext('user-platform');
      const vote = createVote('user-platform', 'platform', 'approve', 'This is a detailed justification explaining why I voted this way based on the evidence provided.');

      const voteResult = resolver.addVote(dispute, vote, context);
      expect(voteResult.errors).toHaveLength(0);
      expect(voteResult.dispute?.votes).toHaveLength(1);
      expect(voteResult.dispute?.votes[0].voterId).toBe('user-platform');
      expect(voteResult.dispute?.votes[0].choice).toBe('approve');
    });

    it('should prevent duplicate votes from same voterId', () => {
      const createResult = resolver.create(createValidInput());
      const dispute = createResult.dispute!;
      const context = createValidContext('user-platform');
      const vote1 = createVote('user-platform', 'platform', 'approve', 'This is a detailed justification explaining why I voted this way based on the evidence provided.');
      const vote2 = createVote('user-platform', 'platform', 'reject', 'Another detailed justification explaining why I changed my vote based on new evidence.');

      const firstVote = resolver.addVote(dispute, vote1, context);
      const secondVote = resolver.addVote(firstVote.dispute!, vote2, context);

      expect(secondVote.errors.length).toBeGreaterThan(0);
      expect(secondVote.errors.some((e) => e.includes('duplicado') || e.includes('já votou'))).toBe(true);
    });

    it('should return INVALID_VOTER when voterId is not in committee', () => {
      const createResult = resolver.create(createValidInput());
      const dispute = createResult.dispute!;
      const context = createValidContext('unauthorized-user');
      const vote = createVote('unauthorized-user', 'platform', 'approve', 'This is a detailed justification explaining why I voted this way based on the evidence provided.');

      const voteResult = resolver.addVote(dispute, vote, context);
      expect(voteResult.errors.length).toBeGreaterThan(0);
      expect(voteResult.errors.some((e) => e.includes('INVALID_VOTER'))).toBe(true);
    });

    it('should return CONFLICT_OF_INTEREST when voterId is challengerId', () => {
      const createResult = resolver.create(createValidInput());
      const dispute = createResult.dispute!;
      const context: DisputeContext = {
        challengerId: 'user-platform',
        challengedId: 'challenged-user',
        now: new Date(),
      };
      const vote = createVote('user-platform', 'platform', 'approve', 'This is a detailed justification explaining why I voted this way based on the evidence provided.');

      const voteResult = resolver.addVote(dispute, vote, context);
      expect(voteResult.errors.length).toBeGreaterThan(0);
      expect(voteResult.errors.some((e) => e.includes('CONFLICT_OF_INTEREST'))).toBe(true);
    });

    it('should return CONFLICT_OF_INTEREST when voterId is challengedId', () => {
      const createResult = resolver.create(createValidInput());
      const dispute = createResult.dispute!;
      const context: DisputeContext = {
        challengerId: 'challenger-user',
        challengedId: 'user-external',
        now: new Date(),
      };
      const vote = createVote('user-external', 'external_maintainer', 'approve', 'This is a detailed justification explaining why I voted this way based on the evidence provided.');

      const voteResult = resolver.addVote(dispute, vote, context);
      expect(voteResult.errors.length).toBeGreaterThan(0);
      expect(voteResult.errors.some((e) => e.includes('CONFLICT_OF_INTEREST'))).toBe(true);
    });

    it('should validate voter membership BEFORE conflict of interest', () => {
      const createResult = resolver.create(createValidInput());
      const dispute = createResult.dispute!;
      const context: DisputeContext = {
        challengerId: 'unknown-user',
        challengedId: 'another-user',
        now: new Date(),
      };
      // Voter is neither in committee nor a party - should fail INVALID_VOTER first
      const vote = createVote('unknown-user', 'platform', 'approve', 'This is a detailed justification explaining why I voted this way based on the evidence provided.');

      const voteResult = resolver.addVote(dispute, vote, context);
      expect(voteResult.errors.some((e) => e.includes('INVALID_VOTER'))).toBe(true);
      expect(voteResult.errors.some((e) => e.includes('CONFLICT_OF_INTEREST'))).toBe(false);
    });

    it('should resolve dispute when quorum is reached (2 votes)', () => {
      const createResult = resolver.create(createValidInput());
      let dispute = createResult.dispute!;

      const vote1 = createVote('user-platform', 'platform', 'approve', 'This is a detailed justification explaining why I voted this way based on the evidence provided.');
      const vote2 = createVote('user-external', 'external_maintainer', 'approve', 'This is a detailed justification explaining why I voted this way based on the evidence provided.');

      const result1 = resolver.addVote(dispute, vote1, createValidContext('user-platform'));
      dispute = result1.dispute!;

      const result2 = resolver.addVote(dispute, vote2, createValidContext('user-external'));

      expect(result2.errors).toHaveLength(0);
      expect(result2.dispute?.status).toBe('resolved');
      expect(result2.dispute?.votes).toHaveLength(2);
    });

    it('should maintain immutability (return new object)', () => {
      const createResult = resolver.create(createValidInput());
      const originalDispute = createResult.dispute!;
      const context = createValidContext('user-platform');
      const vote = createVote('user-platform', 'platform', 'approve', 'This is a detailed justification explaining why I voted this way based on the evidence provided.');

      const voteResult = resolver.addVote(originalDispute, vote, context);

      expect(originalDispute.votes).toHaveLength(0);
      expect(voteResult.dispute?.votes).toHaveLength(1);
      expect(originalDispute).not.toBe(voteResult.dispute);
    });

    it('should not allow voting on resolved dispute', () => {
      const createResult = resolver.create(createValidInput());
      let dispute = createResult.dispute!;

      const vote1 = createVote('user-platform', 'platform', 'approve', 'This is a detailed justification explaining why I voted this way based on the evidence provided.');
      const vote2 = createVote('user-external', 'external_maintainer', 'approve', 'This is a detailed justification explaining why I voted this way based on the evidence provided.');
      const vote3 = createVote('user-community', 'community_lancer', 'reject', 'This is a detailed justification explaining why I voted this way based on the evidence provided.');

      dispute = resolver.addVote(dispute, vote1, createValidContext('user-platform')).dispute!;
      dispute = resolver.addVote(dispute, vote2, createValidContext('user-external')).dispute!;

      const voteResult = resolver.addVote(dispute, vote3, createValidContext('user-community'));
      expect(voteResult.errors.length).toBeGreaterThan(0);
      expect(voteResult.errors.some((e) => e.includes('pendente') || e.includes('status'))).toBe(true);
    });

    it('should not allow voting on escalated dispute', () => {
      const createResult = resolver.create(createValidInput());
      let dispute = createResult.dispute!;
      dispute = { ...dispute, status: 'escalated' };

      const context = createValidContext('user-platform');
      const vote = createVote('user-platform', 'platform', 'approve', 'This is a detailed justification explaining why I voted this way based on the evidence provided.');

      const voteResult = resolver.addVote(dispute, vote, context);
      expect(voteResult.errors.length).toBeGreaterThan(0);
    });

    it('should not allow voting on expired dispute', () => {
      const createResult = resolver.create(createValidInput());
      let dispute = createResult.dispute!;
      dispute = { ...dispute, status: 'expired' };

      const context = createValidContext('user-platform');
      const vote = createVote('user-platform', 'platform', 'approve', 'This is a detailed justification explaining why I voted this way based on the evidence provided.');

      const voteResult = resolver.addVote(dispute, vote, context);
      expect(voteResult.errors.length).toBeGreaterThan(0);
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
      expect(decision.decision).toBeNull();
    });

    it('should return approve when majority votes approve', () => {
      const createResult = resolver.create(createValidInput());
      let dispute = createResult.dispute!;

      const vote1 = createVote('user-platform', 'platform', 'approve', 'This is a detailed justification explaining why I voted this way based on the evidence provided.');
      const vote2 = createVote('user-external', 'external_maintainer', 'approve', 'This is a detailed justification explaining why I voted this way based on the evidence provided.');

      dispute = resolver.addVote(dispute, vote1, createValidContext('user-platform')).dispute!;
      dispute = resolver.addVote(dispute, vote2, createValidContext('user-external')).dispute!;

      const decision = resolver.getDecision(dispute);
      expect(decision.decision).toBe('approve');
    });

    it('should return reject when majority votes reject', () => {
      const createResult = resolver.create(createValidInput());
      let dispute = createResult.dispute!;

      const vote1 = createVote('user-platform', 'platform', 'reject', 'This is a detailed justification explaining why I voted this way based on the evidence provided.');
      const vote2 = createVote('user-community', 'community_lancer', 'reject', 'This is a detailed justification explaining why I voted this way based on the evidence provided.');

      dispute = resolver.addVote(dispute, vote1, createValidContext('user-platform')).dispute!;
      dispute = resolver.addVote(dispute, vote2, createValidContext('user-community')).dispute!;

      const decision = resolver.getDecision(dispute);
      expect(decision.decision).toBe('reject');
    });

    it('should return null for escalated dispute', () => {
      const createResult = resolver.create(createValidInput());
      let dispute = createResult.dispute!;
      dispute = { ...dispute, status: 'escalated' };

      const decision = resolver.getDecision(dispute);
      expect(decision.decision).toBeNull();
    });

    it('should return null for expired dispute', () => {
      const createResult = resolver.create(createValidInput());
      let dispute = createResult.dispute!;
      dispute = { ...dispute, status: 'expired' };

      const decision = resolver.getDecision(dispute);
      expect(decision.decision).toBeNull();
    });
  });
});
