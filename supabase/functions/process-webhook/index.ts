import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { errorResponse, handleOptions } from "../_shared/error-response.ts";
import { createVCSAdapter } from "../_shared/vcs-adapter.ts";
import { createSupabaseClient } from "../_shared/supabase-client.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return handleOptions();

  try {
    const payload = await req.arrayBuffer();
    const signature = req.headers.get("X-Hub-Signature-256") || "";
    const webhookSecret = Deno.env.get("GITHUB_WEBHOOK_SECRET")!;

    // 1. Validar HMAC
    const vcsAdapter = createVCSAdapter();
    const isValid = await vcsAdapter.validateWebhook(
      new Uint8Array(payload),
      signature,
      webhookSecret
    );

    if (!isValid) {
      return errorResponse(401, "Invalid signature");
    }

    // 2. Parsear payload
    const event = JSON.parse(new TextDecoder().decode(payload));
    const supabase = createSupabaseClient();

    // 3. Roteamento
    const shouldCalculate =
      event.action === "opened" || event.action === "synchronize";
    const shouldRelease =
      event.action === "closed" && event.pull_request?.merged === true;

    if (!shouldCalculate && !shouldRelease) {
      return new Response(JSON.stringify({ received: true, ignored: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 4. Buscar contributionId pelo PR URL
    const prUrl = event.pull_request.html_url;
    const { data: contribution } = await supabase
      .from("contributions")
      .select("id")
      .eq("pr_url", prUrl)
      .single();

    if (!contribution) {
      return new Response(JSON.stringify({ received: true, noContribution: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 5. Invocar a função correta
    const targetFn = shouldCalculate ? "calculate-score" : "release-payment";
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    await fetch(`${supabaseUrl}/functions/v1/${targetFn}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({ prUrl, contributionId: contribution.id }),
    });

    return new Response(JSON.stringify({ received: true, routed: targetFn }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return errorResponse(500, "Internal error", String(err));
  }
});
