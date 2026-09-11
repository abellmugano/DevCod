import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { errorResponse, handleOptions } from "../_shared/error-response.ts";
import { createDataAdapter } from "../_shared/data-adapter.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return handleOptions();

  try {
    const { userId, amount, reason, referenceId } = await req.json();
    if (!userId || !amount || !reason) return errorResponse(400, "userId, amount, reason required");

    const dataAdapter = createDataAdapter();
    await dataAdapter.addDevCoins(userId, amount, reason, referenceId);
    await dataAdapter.logEvent(
      "DevCoinsAwarded",
      { userId, amount, reason, referenceId },
      "system"
    );

    return new Response(JSON.stringify({ awarded: true, amount }), {
      status: 200, headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return errorResponse(500, "Award failed", String(err));
  }
});
