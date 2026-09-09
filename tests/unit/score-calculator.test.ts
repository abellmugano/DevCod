import { ScoreCalculator } from '../../src/core/score/ScoreCalculator';
import { ScoreInput } from '../../src/core/score/types';

describe('ScoreCalculator', () => {
  let calculator: ScoreCalculator;
  beforeEach(() => { calculator = new ScoreCalculator(); });

  it('deve calcular score 10 com métricas ideais', () => {
    const input: ScoreInput = { metrics: { domainFilesChanged: 10, cyclomaticComplexityDelta: -5, assertionsAdded: 20, diffCoverage: 100, lintPassed: true }, manualEvaluation: { roadmapImpact: 5, codeQuality: 5, documentationClarity: 5 }, algorithmVersion: 'score_v1' };
    const r = calculator.calculate(input);
    expect(r.success).toBe(true); expect(r.result!.totalScore).toBe(10);
  });
  it('deve calcular score 0 com métricas ruins', () => {
    const input: ScoreInput = { metrics: { domainFilesChanged: 0, cyclomaticComplexityDelta: 10, assertionsAdded: 0, diffCoverage: 0, lintPassed: false }, manualEvaluation: { roadmapImpact: 1, codeQuality: 1, documentationClarity: 1 }, algorithmVersion: 'score_v1' };
    const r = calculator.calculate(input);
    expect(r.success).toBe(true); expect(r.result!.totalScore).toBe(0);
  });
  it('deve aplicar penalidade de 20% sem metrics', () => {
    const input: ScoreInput = { metrics: null, manualEvaluation: { roadmapImpact: 5, codeQuality: 5, documentationClarity: 5 }, algorithmVersion: 'score_v1' };
    const r = calculator.calculate(input);
    expect(r.result!.penaltyApplied).toBe(true); expect(r.result!.totalScore).toBe(4); // (0 * 0.6) + (10 * 0.4)
  });
  it('deve rejeitar avaliação manual < 1', () => {
    const r = calculator.calculate({ metrics: null, manualEvaluation: { roadmapImpact: 0, codeQuality: 3, documentationClarity: 4 }, algorithmVersion: 'score_v1' });
    expect(r.success).toBe(false); expect(r.error!.code).toBe('INVALID_RANGE');
  });
  it('deve rejeitar avaliação manual > 5', () => {
    const r = calculator.calculate({ metrics: null, manualEvaluation: { roadmapImpact: 5, codeQuality: 6, documentationClarity: 4 }, algorithmVersion: 'score_v1' });
    expect(r.success).toBe(false); expect(r.error!.code).toBe('INVALID_RANGE');
  });
  it('deve aplicar pesos 60/40', () => {
    const input: ScoreInput = { metrics: { domainFilesChanged: 5, cyclomaticComplexityDelta: 0, assertionsAdded: 10, diffCoverage: 50, lintPassed: true }, manualEvaluation: { roadmapImpact: 3, codeQuality: 3, documentationClarity: 3 }, algorithmVersion: 'score_v1' };
    const r = calculator.calculate(input);
    expect(r.result!.totalScore).toBeCloseTo(5.7, 1);
  });
  it('deve recompensar redução de complexidade', () => {
    const r = calculator.calculate({ metrics: { domainFilesChanged: 5, cyclomaticComplexityDelta: -10, assertionsAdded: 10, diffCoverage: 80, lintPassed: true }, manualEvaluation: { roadmapImpact: 4, codeQuality: 4, documentationClarity: 4 }, algorithmVersion: 'score_v1' });
    expect(r.result!.breakdown.complexityScore).toBe(10);
  });
  it('deve punir aumento de complexidade', () => {
    const r = calculator.calculate({ metrics: { domainFilesChanged: 5, cyclomaticComplexityDelta: 10, assertionsAdded: 10, diffCoverage: 80, lintPassed: true }, manualEvaluation: { roadmapImpact: 4, codeQuality: 4, documentationClarity: 4 }, algorithmVersion: 'score_v1' });
    expect(r.result!.breakdown.complexityScore).toBe(0);
  });
  it('deve zerar lint se falhar', () => {
    const r = calculator.calculate({ metrics: { domainFilesChanged: 5, cyclomaticComplexityDelta: 0, assertionsAdded: 10, diffCoverage: 80, lintPassed: false }, manualEvaluation: { roadmapImpact: 4, codeQuality: 4, documentationClarity: 4 }, algorithmVersion: 'score_v1' });
    expect(r.result!.breakdown.lintScore).toBe(0);
  });
  it('deve aplicar pesos manuais 50/30/20', () => {
    const r = calculator.calculate({ metrics: null, manualEvaluation: { roadmapImpact: 5, codeQuality: 3, documentationClarity: 4 }, algorithmVersion: 'score_v1' });
    expect(r.result!.manualScore).toBe(8.4); // (10*0.5) + (6*0.3) + (8*0.2) = 5 + 1.8 + 1.6
  });
  it('deve retornar breakdown completo', () => {
    const r = calculator.calculate({ metrics: { domainFilesChanged: 5, cyclomaticComplexityDelta: -2, assertionsAdded: 15, diffCoverage: 90, lintPassed: true }, manualEvaluation: { roadmapImpact: 4, codeQuality: 4, documentationClarity: 4 }, algorithmVersion: 'score_v1' });
    expect(r.result!.breakdown.domainFilesScore).toBeDefined();
  });
  it('deve registrar versão do algoritmo', () => {
    const r = calculator.calculate({ metrics: null, manualEvaluation: { roadmapImpact: 3, codeQuality: 3, documentationClarity: 3 }, algorithmVersion: 'score_v1' });
    expect(r.result!.algorithmVersion).toBe('score_v1');
  });
});
