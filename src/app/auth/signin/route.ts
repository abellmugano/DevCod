import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${origin}/auth/callback`,
      scopes: "read:user user:email",
    },
  });

  if (error || !data.url) {
    return NextResponse.redirect(`${origin}/?auth_error=oauth_start_failed`);
  }

  return NextResponse.redirect(data.url);
}