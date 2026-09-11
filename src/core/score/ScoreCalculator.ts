import { ScoreInput, ScoreResult, ScoreCalculationError, ScoreBreakdown } from './types.ts';

export const ALGORITHM_VERSION = 'score_v1';
export const AUTO_WEIGHT = 0.6;
export const MANUAL_WEIGHT = 0.4;
export const PENALTY_FACTOR = 0.8;

export class ScoreCalculator {
  calculate(input: ScoreInput): { success: boolean; result?: ScoreResult; error?: ScoreCalculationError } {
    // 1. Validar avaliação manual (1-5)
    const manualFields = ['roadmapImpact', 'codeQuality', 'documentationClarity'] as const;
    for (const field of manualFields) {
      const val = input.manualEvaluation[field];
      if (typeof val !== 'number' || val < 1 || val > 5) {
        return { 
          success: false, 
          error: { field: `manualEvaluation.${field}`, code: 'INVALID_RANGE', message: `O valor de ${field} deve estar entre 1 e 5` } 
        };
      }
    }

    // 2. Calcular componente automático
    let autoScore = 0;
    let metricsPresent = false;
    let penaltyApplied = false;
    let breakdown: ScoreBreakdown = {
      domainFilesScore: 0, complexityScore: 0, assertionsScore: 0,
      coverageScore: 0, lintScore: 0, roadmapImpactScore: 0,
      codeQualityScore: 0, documentationScore: 0
    };

    if (input.metrics === null) {
      autoScore = 0;
      penaltyApplied = true;
    } else {
      metricsPresent = true;
      breakdown.domainFilesScore = this.clamp((input.metrics.domainFilesChanged / 10) * 10, 0, 10);
      breakdown.complexityScore = this.clamp(5 - (input.metrics.cyclomaticComplexityDelta / 2), 0, 10);
      breakdown.assertionsScore = this.clamp((input.metrics.assertionsAdded / 20) * 10, 0, 10);
      breakdown.coverageScore = this.clamp(input.metrics.diffCoverage / 10, 0, 10);
      breakdown.lintScore = input.metrics.lintPassed ? 10 : 0;

      autoScore = (breakdown.domainFilesScore * 0.2) + 
                  (breakdown.complexityScore * 0.2) + 
                  (breakdown.assertionsScore * 0.2) + 
                  (breakdown.coverageScore * 0.2) + 
                  (breakdown.lintScore * 0.2);
    }

    // 3. Calcular componente manual
    breakdown.roadmapImpactScore = input.manualEvaluation.roadmapImpact * 2;
    breakdown.codeQualityScore = input.manualEvaluation.codeQuality * 2;
    breakdown.documentationScore = input.manualEvaluation.documentationClarity * 2;

    const manualScore = (breakdown.roadmapImpactScore * 0.5) + 
                        (breakdown.codeQualityScore * 0.3) + 
                        (breakdown.documentationScore * 0.2);

    // 4. Aplicar penalidade
    if (penaltyApplied) {
      autoScore = autoScore * PENALTY_FACTOR;
    }

    // 5. Calcular total
    const totalScore = (autoScore * AUTO_WEIGHT) + (manualScore * MANUAL_WEIGHT);

    return {
      success: true,
      result: {
        totalScore: this.round(totalScore, 2),
        autoScore: this.round(autoScore, 2),
        manualScore: this.round(manualScore, 2),
        metricsPresent,
        penaltyApplied,
        algorithmVersion: ALGORITHM_VERSION,
        breakdown
      }
    };
  }

  calculateAutoScore(metrics: ScoreInput['metrics']): { success: boolean; score?: number; penaltyApplied?: boolean } {
    // Dummy manual evaluation para reutilizar a lógica
    const dummyManual = { roadmapImpact: 3, codeQuality: 3, documentationClarity: 3 };
    const result = this.calculate({ metrics, manualEvaluation: dummyManual, algorithmVersion: ALGORITHM_VERSION });
    if (result.success && result.result) {
      return { success: true, score: result.result.autoScore, penaltyApplied: result.result.penaltyApplied };
    }
    return { success: false };
  }

  calculateManualScore(evaluation: ScoreInput['manualEvaluation']): { success: boolean; score?: number; error?: ScoreCalculationError } {
    const result = this.calculate({ metrics: null, manualEvaluation: evaluation, algorithmVersion: ALGORITHM_VERSION });
    if (result.success && result.result) {
      return { success: true, score: result.result.manualScore };
    }
    return { success: false, error: result.error };
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  private round(value: number, decimals: number): number {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }
}
