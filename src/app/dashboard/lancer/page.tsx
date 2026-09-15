import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function LancerDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/signin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("github_username, reputation_score")
    .eq("id", user.id)
    .single();

  const { data: challenges } = await supabase
    .from("challenges")
    .select("id, title, reward_amount, status, created_at")
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(10);

  const { data: applications } = await supabase
    .from("applications")
    .select("id, challenge_id, status, created_at")
    .eq("dev_id", user.id)
    .order("created_at", { ascending: false });

  const { data: contributions } = await supabase
    .from("contributions")
    .select("id, challenge_id, score, status, created_at")
    .eq("dev_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Olá, {profile?.github_username ?? user.email}
        </h1>
        <p className="text-sm text-slate-600">
          Reputação: {profile?.reputation_score ?? 0}
        </p>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-3">
          Desafios Abertos ({challenges?.length ?? 0})
        </h2>
        <div className="space-y-2">
          {(challenges ?? []).map((c) => (
            <div key={c.id} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="font-medium">{c.title}</div>
              <div className="text-sm text-slate-600">R$ {c.reward_amount}</div>
            </div>
          ))}
          {(challenges ?? []).length === 0 && (
            <p className="text-sm text-slate-500">Nenhum desafio aberto.</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">
          Minhas Candidaturas ({applications?.length ?? 0})
        </h2>
        <div className="space-y-2">
          {(applications ?? []).map((a) => (
            <div key={a.id} className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
              Desafio {a.challenge_id.slice(0, 8)} — {a.status}
            </div>
          ))}
          {(applications ?? []).length === 0 && (
            <p className="text-sm text-slate-500">Nenhuma candidatura.</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">
          Minhas Contribuições ({contributions?.length ?? 0})
        </h2>
        <div className="space-y-2">
          {(contributions ?? []).map((c) => (
            <div key={c.id} className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
              Desafio {c.challenge_id.slice(0, 8)} — Score: {c.score ?? "—"}
            </div>
          ))}
          {(contributions ?? []).length === 0 && (
            <p className="text-sm text-slate-500">Nenhuma contribuição.</p>
          )}
        </div>
      </section>
    </div>
  );
}