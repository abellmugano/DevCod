import { corsHeaders, JSON_HEADERS } from "./cors.ts";

export function errorResponse(status: number, message: string, details?: any): Response {
  return new Response(
    JSON.stringify({ error: message, details }),
    { status, headers: { ...corsHeaders, ...JSON_HEADERS } }
  );
}

export function handleOptions(): Response {
  return new Response(null, { status: 204, headers: corsHeaders });
}
