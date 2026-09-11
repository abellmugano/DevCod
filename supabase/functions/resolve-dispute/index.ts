import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { errorResponse, handleOptions } from "../_shared/error-response.ts";
import { createDataAdapter } from "../_shared/data-adapter.ts";
import { createPaymentAdapter } from "../_shared/payment-adapter.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return handleOptions();

  try {
    const { disputeId, decision } = await req.json();
    if (!disputeId || !decision) return errorResponse(400, "disputeId and decision required");
    if (!["approve", "reject"].includes(decision)) return errorResponse(400, "decision must be approve or reject");

    const dataAdapter = createDataAdapter();
    const dispute = await dataAdapter.getDispute(disputeId);
    if (!dispute) return errorResponse(404, "Dispute not found");
    if (dispute.status !== "pending") return errorResponse(400, `Dispute already ${dispute.status}`);

    await dataAdapter.updateDisputeStatus(disputeId, "resolved", decision);

    if (decision === "approve" && dispute.payment_intent_id) {
      const paymentAdapter = createPaymentAdapter();
      try {
        await paymentAdapter.releaseEscrowPayment(
          dispute.payment_intent_id,
          dispute.challenger_stripe_account_id || "",
          dispute.original_score || 0,
          10
        );
      } catch (stripeErr) {
        // Se Stripe falhar, continua mas regista erro
        console.error("Stripe release failed:", stripeErr);
      }
    }

    await dataAdapter.logEvent(
      "DisputeResolved",
      { disputeId, decision, challengerId: dispute.challenger_id, challengeId: dispute.challenge_id },
      "system"
    );

    return new Response(JSON.stringify({ resolved: true, disputeId, decision }), {
      status: 200, headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return errorResponse(500, "Dispute resolution failed", String(err));
  }
});
