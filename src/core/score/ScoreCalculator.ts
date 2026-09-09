import type {
  ChallengeMetrics,
  ManualEvaluation,
  ScoreInput,
  ScoreBreakdown,
} from './types';

export class ScoreCalculator {
  private static readonly AUTO_WEIGHTS = {
    domainFilesChanged: 0.2,
    cyclomaticComplexityDelta: 0.2,
    assertionsAdded: 0.2,
    diffCoverage: 0.2,
    lintPassed: 0.2,
  };

  private static readonly MANUAL_WEIGHTS = {
    roadmapImpact: 0.5,
    codeQuality: 0.3,
    documentationClarity: 0.2,
  };

  private static readonly VERSION = 'score_v1';

  /**
   * Calcula a pontuação completa com breakdown para auditoria
   */
  calculate(input: ScoreInput): ScoreBreakdown {
    const penaltyApplied = !input.metrics;
    const autoScore = this.calculateAutoScore(input.metrics);
    const manualScore = input.evaluation ? this.calculateManualScore(input.evaluation) : 0;

    const totalScore = (autoScore * 0.6) + (manualScore * 0.4);

    return {
      autoScore: this.round(autoScore),
      manualScore: this.round(manualScore),
      totalScore: this.round(totalScore),
      penaltyApplied,
      version: this.VERSION,
      autoBreakdown: this.buildAutoBreakdown(input.metrics),
      manualBreakdown: this.buildManualBreakdown(input.evaluation),
    };
  }

  /**
   * Calcula o componente automático (0-10)
   * Se metrics ausente → retorna 0
   */
  calculateAutoScore(metrics?: ChallengeMetrics): number {
    if (!metrics) {
      return 0;
    }

    const domainScore = this.clamp(metrics.domainFilesChanged, 0, 10);
    const complexityScore = this.clamp(metrics.cyclomaticComplexityDelta, 0, 10);
    const assertionsScore = this.clamp(metrics.assertionsAdded, 0, 10);
    const coverageScore = this.clamp(metrics.diffCoverage, 0, 10);
    const lintScore = metrics.lintPassed ? 10 : 0;

    const autoScore =
      domainScore * ScoreCalculator.AUTO_WEIGHTS.domainFilesChanged +
      complexityScore * ScoreCalculator.AUTO_WEIGHTS.cyclomaticComplexityDelta +
      assertionsScore * ScoreCalculator.AUTO_WEIGHTS.assertionsAdded +
      coverageScore * ScoreCalculator.AUTO_WEIGHTS.diffCoverage +
      lintScore * ScoreCalculator.AUTO_WEIGHTS.lintPassed;

    return this.round(autoScore);
  }

  /**
   * Calcula o componente manual (0-10)
   * Normaliza escala 1-5 para 2-10 (multiplicando por 2)
   */
  calculateManualScore(evaluation: ManualEvaluation): number {
    const roadmapNormalized = this.clamp(evaluation.roadmapImpact, 1, 5) * 2;
    const qualityNormalized = this.clamp(evaluation.codeQuality, 1, 5) * 2;
    const docNormalized = this.clamp(evaluation.documentationClarity, 1, 5) * 2;

    const manualScore =
      roadmapNormalized * ScoreCalculator.MANUAL_WEIGHTS.roadmapImpact +
      qualityNormalized * ScoreCalculator.MANUAL_WEIGHTS.codeQuality +
      docNormalized * ScoreCalculator.MANUAL_WEIGHTS.documentationClarity;

    return this.round(manualScore);
  }

  private buildAutoBreakdown(metrics?: ChallengeMetrics): ScoreBreakdown['autoBreakdown'] {
    if (!metrics) {
      return {
        domainFilesChanged: { value: 0, weight: 0.2, weighted: 0 },
        cyclomaticComplexityDelta: { value: 0, weight: 0.2, weighted: 0 },
        assertionsAdded: { value: 0, weight: 0.2, weighted: 0 },
        diffCoverage: { value: 0, weight: 0.2, weighted: 0 },
        lintPassed: { value: 0, weight: 0.2, weighted: 0 },
      };
    }

    const domainValue = this.clamp(metrics.domainFilesChanged, 0, 10);
    const complexityValue = this.clamp(metrics.cyclomaticComplexityDelta, 0, 10);
    const assertionsValue = this.clamp(metrics.assertionsAdded, 0, 10);
    const coverageValue = this.clamp(metrics.diffCoverage, 0, 10);
    const lintValue = metrics.lintPassed ? 10 : 0;

    return {
      domainFilesChanged: {
        value: domainValue,
        weight: 0.2,
        weighted: this.round(domainValue * 0.2),
      },
      cyclomaticComplexityDelta: {
        value: complexityValue,
        weight: 0.2,
        weighted: this.round(complexityValue * 0.2),
      },
      assertionsAdded: {
        value: assertionsValue,
        weight: 0.2,
        weighted: this.round(assertionsValue * 0.2),
      },
      diffCoverage: {
        value: coverageValue,
        weight: 0.2,
        weighted: this.round(coverageValue * 0.2),
      },
      lintPassed: {
        value: lintValue,
        weight: 0.2,
        weighted: this.round(lintValue * 0.2),
      },
    };
  }

  private buildManualBreakdown(evaluation?: ManualEvaluation): ScoreBreakdown['manualBreakdown'] {
    if (!evaluation) {
      return {
        roadmapImpact: { value: 0, normalized: 0, weight: 0.5, weighted: 0 },
        codeQuality: { value: 0, normalized: 0, weight: 0.3, weighted: 0 },
        documentationClarity: { value: 0, normalized: 0, weight: 0.2, weighted: 0 },
      };
    }

    const roadmapValue = this.clamp(evaluation.roadmapImpact, 1, 5);
    const qualityValue = this.clamp(evaluation.codeQuality, 1, 5);
    const docValue = this.clamp(evaluation.documentationClarity, 1, 5);

    const roadmapNormalized = roadmapValue * 2;
    const qualityNormalized = qualityValue * 2;
    const docNormalized = docValue * 2;

    return {
      roadmapImpact: {
        value: roadmapValue,
        normalized: roadmapNormalized,
        weight: 0.5,
        weighted: this.round(roadmapNormalized * 0.5),
      },
      codeQuality: {
        value: qualityValue,
        normalized: qualityNormalized,
        weight: 0.3,
        weighted: this.round(qualityNormalized * 0.3),
      },
      documentationClarity: {
        value: docValue,
        normalized: docNormalized,
        weight: 0.2,
        weighted: this.round(docNormalized * 0.2),
      },
    };
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
