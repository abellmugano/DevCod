import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { errorResponse, handleOptions } from "../_shared/error-response.ts";
import { createDataAdapter } from "../_shared/data-adapter.ts";
import { createPaymentAdapter } from "../_shared/payment-adapter.ts";

function calculateDevCoins(score: number): number {
  if (score >= 9.0) return 500;
  if (score >= 8.0) return 300;
  if (score >= 7.0) return 200;
  return 100;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return handleOptions();

  try {
    const { contributionId } = await req.json();
    if (!contributionId) return errorResponse(400, "contributionId required");

    const dataAdapter = createDataAdapter();
    const paymentAdapter = createPaymentAdapter();

    const contribution = await dataAdapter.getContribution(contributionId);
    if (!contribution) return errorResponse(404, "Contribution not found");
    if (contribution.score === null) return errorResponse(400, "Score not calculated");

    // Verificar disputas ativas
    const disputes = await dataAdapter.listDisputesByContribution(contributionId);
    const activeDispute = disputes.find((d) => d.status === "pending");

    if (activeDispute) {
      await paymentAdapter.holdPayment(contribution.paymentIntentId);
      return new Response(
        JSON.stringify({ held: true, disputeId: activeDispute.id }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Liberar pagamento
    const payout = await paymentAdapter.releaseEscrowPayment(
      contribution.paymentIntentId,
      contribution.stripeAccountId,
      contribution.score,
      10
    );

    await dataAdapter.logEvent(
      "PaymentReleased",
      {
        contributionId,
        payoutId: payout.payoutId,
        amount: payout.amount,
        score: contribution.score,
      },
      contribution.devId
    );

    // Premiar DevCoins
    const devCoins = calculateDevCoins(contribution.score);
    await dataAdapter.addDevCoins(
      contribution.devId,
      devCoins,
      "CONTRIBUTION_ACCEPTED",
      contributionId
    );

    return new Response(JSON.stringify(payout), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return errorResponse(500, "Internal error", String(err));
  }
});
