import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { errorResponse, handleOptions } from "../_shared/error-response.ts";
import { createDataAdapter } from "../_shared/data-adapter.ts";
import { createSupabaseClient } from "../_shared/supabase-client.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return handleOptions();

  try {
    const dataAdapter = createDataAdapter();
    const isValid = await dataAdapter.verifyEventLogChain();

    if (!isValid) {
      const supabase = createSupabaseClient();
      await supabase.from("security_alerts").insert({
        type: "EVENT_LOG_INTEGRITY_BREACH",
        severity: "critical",
        details: { detectedAt: new Date().toISOString() },
      });
      return new Response(
        JSON.stringify({ valid: false, message: "Event log integrity compromised" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ valid: true }), {
      status: 200, headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return errorResponse(500, "Verification failed", String(err));
  }
});
