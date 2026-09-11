import { SupabaseAdapter } from "../../../src/adapters/db/supabase.ts";
import { createSupabaseClient } from "./supabase-client.ts";

export { SupabaseAdapter };

export function createDataAdapter(): SupabaseAdapter {
  const supabase = createSupabaseClient();
  const hmacSecret = Deno.env.get("HMAC_SECRET")!;
  return new SupabaseAdapter(supabase, hmacSecret);
}
