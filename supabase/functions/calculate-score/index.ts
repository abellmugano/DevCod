import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { errorResponse, handleOptions } from "../_shared/error-response.ts";
import { createDataAdapter } from "../_shared/data-adapter.ts";
import { createVCSAdapter } from "../_shared/vcs-adapter.ts";
import { ScoreCalculator } from "../_shared/score-calculator.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return handleOptions();

  try {
    const { prUrl, contributionId, manualEvaluation } = await req.json();

    if (!prUrl || !contributionId) {
      return errorResponse(400, "prUrl and contributionId are required");
    }

    const dataAdapter = createDataAdapter();
    const vcsAdapter = createVCSAdapter();
    const scoreCalculator = new ScoreCalculator();

    // Coletar dados do PR
    const prData = await vcsAdapter.getPullRequest(prUrl);
    const metrics = await vcsAdapter.getMetrics(prUrl);

    const evaluation = manualEvaluation || {
      roadmapImpact: 3,
      codeQuality: 3,
      documentationClarity: 3,
    };

    // Calcular score
    const scoreResult = scoreCalculator.calculate({
      metrics,
      manualEvaluation: evaluation,
      algorithmVersion: "score_v1",
    });

    if (!scoreResult.success) {
      return errorResponse(400, scoreResult.error.message);
    }

    // Persistir
    await dataAdapter.updateContributionScore(contributionId, scoreResult.result);
    await dataAdapter.logEvent(
      "ScoreCalculated",
      { contributionId, score: scoreResult.result.totalScore },
      "system"
    );

    return new Response(JSON.stringify(scoreResult.result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return errorResponse(500, "Internal error", String(err));
  }
});
