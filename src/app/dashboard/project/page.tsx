import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProjectDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/signin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("github_username")
    .eq("id", user.id)
    .single();

  const { data: projects } = await supabase
    .from("projects")
    .select("id, name")
    .eq("owner_id", user.id);

  const projectIds = (projects ?? []).map((p) => p.id);

  const challenges = projectIds.length > 0
    ? ((await supabase
        .from("challenges")
        .select("id, title, status, reward_amount, created_at")
        .in("project_id", projectIds)
        .order("created_at", { ascending: false })).data ?? [])
    : [];

  const challengeIds = challenges.map((c) => c.id);

  const applications = challengeIds.length > 0
    ? ((await supabase
        .from("applications")
        .select("id, challenge_id, dev_id, status, created_at")
        .in("challenge_id", challengeIds)
        .order("created_at", { ascending: false })).data ?? [])
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Olá, {profile?.github_username ?? user.email}
        </h1>
        <p className="text-sm text-slate-600">
          Projetos: {projects?.length ?? 0}
        </p>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-3">
          Meus Desafios ({challenges.length})
        </h2>
        <div className="space-y-2">
          {challenges.map((c) => (
            <div key={c.id} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="font-medium">{c.title}</div>
              <div className="text-sm text-slate-600">
                {c.status} — R$ {c.reward_amount}
              </div>
            </div>
          ))}
          {challenges.length === 0 && (
            <p className="text-sm text-slate-500">Nenhum desafio criado.</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">
          Candidaturas Recebidas ({applications.length})
        </h2>
        <div className="space-y-2">
          {applications.map((a) => (
            <div key={a.id} className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
              Desafio {a.challenge_id.slice(0, 8)} — {a.status}
            </div>
          ))}
          {applications.length === 0 && (
            <p className="text-sm text-slate-500">Nenhuma candidatura.</p>
          )}
        </div>
      </section>
    </div>
  );
}