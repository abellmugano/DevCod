import { AuthButton } from "@/components/AuthButton";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/signin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role ?? "dev";

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-xs font-bold text-white">
              D
            </span>
            <span className="text-lg font-semibold tracking-tight">DevCod</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/dashboard/lancer" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Lancer
            </Link>
            {(role === "maintainer" || role === "admin") && (
              <Link href="/dashboard/project" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                Projeto
              </Link>
            )}
            <AuthButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}