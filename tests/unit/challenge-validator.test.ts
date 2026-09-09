import { ChallengeValidator } from '../../src/core/challenge/ChallengeValidator';
import { ChallengeInput, ErrorCode } from '../../src/core/challenge/types';

describe('ChallengeValidator', () => {
  let validator: ChallengeValidator;
  const validInput: ChallengeInput = {
    title: 'Implementar login OAuth2', description: 'Adicionar suporte a OAuth2',
    weights: { functionality: 40, quality: 30, documentation: 15, security: 15 },
    rewardAmount: 500000, deadlineDays: 14, repositoryUrl: 'https://github.com/devcod/devcod',
  };
  beforeEach(() => { validator = new ChallengeValidator(); });

  it('deve aceitar pesos válidos', () => { expect(validator.validate(validInput).valid).toBe(true); });
  it('deve rejeitar qualidade < 20%', () => { expect(validator.validate({...validInput, weights: {...validInput.weights, quality: 10}}).errors.some(e => e.field === 'weights.quality')).toBe(true); });
  it('deve rejeitar soma != 100', () => { expect(validator.validate({...validInput, weights: {...validInput.weights, functionality: 50}}).errors.some(e => e.code === ErrorCode.INVALID_SUM)).toBe(true); });
  it('deve rejeitar recompensa <= 0', () => { expect(validator.validate({...validInput, rewardAmount: 0}).errors.some(e => e.field === 'rewardAmount')).toBe(true); });
  it('deve rejeitar título vazio', () => { expect(validator.validate({...validInput, title: ''}).errors.some(e => e.field === 'title')).toBe(true); });
  it('deve rejeitar título < 5 chars', () => { expect(validator.validate({...validInput, title: 'Bug'}).errors.some(e => e.field === 'title')).toBe(true); });
  it('deve rejeitar peso com tipo inválido', () => { expect(validator.validate({...validInput, weights: {...validInput.weights, quality: '20' as any}}).errors.some(e => e.code === ErrorCode.INVALID_TYPE)).toBe(true); });
  it('deve rejeitar funcionalidade < 30%', () => { expect(validator.validate({...validInput, weights: {...validInput.weights, functionality: 20}}).errors.some(e => e.field === 'weights.functionality')).toBe(true); });
  it('deve rejeitar URL fora do GitHub', () => { expect(validator.validate({...validInput, repositoryUrl: 'https://gitlab.com/x/y'}).errors.some(e => e.code === ErrorCode.INVALID_FORMAT)).toBe(true); });
  it('deve rejeitar prazo 0', () => { expect(validator.validate({...validInput, deadlineDays: 0}).errors.some(e => e.field === 'deadlineDays')).toBe(true); });
  it('deve rejeitar prazo > 180', () => { expect(validator.validate({...validInput, deadlineDays: 200}).errors.some(e => e.field === 'deadlineDays')).toBe(true); });
  it('deve retornar TODOS os erros', () => { 
    const r = validator.validate({ title: '', description: '', weights: {functionality:10, quality:5, documentation:5, security:5}, rewardAmount: -100, deadlineDays: 0, repositoryUrl: 'x' });
    expect(r.errors.length).toBeGreaterThanOrEqual(6); 
  });
});
