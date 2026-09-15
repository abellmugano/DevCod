import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardRoot() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/signin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role ?? "dev";

  if (role === "maintainer") redirect("/dashboard/project");
  redirect("/dashboard/lancer");
}