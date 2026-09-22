"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (loading) return <span className="w-20 h-8" aria-hidden="true" />;

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <a href="/dashboard" className="font-mono text-[11px] uppercase tracking-[0.12em] text-slate-300 transition-colors hover:text-white">
          Dashboard
        </a>
        <button
          onClick={handleLogout}
          className="font-mono text-[11px] uppercase tracking-[0.12em] text-slate-300 transition-colors hover:text-white"
          type="button"
        >
          Sair
        </button>
      </div>
    );
  }

  return (
    <a
      href="/auth/signin"
      className="border border-[#b6ff45] bg-[#b6ff45] px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[#070908] transition-colors hover:border-white hover:bg-white"
    >
      Entrar com GitHub
    </a>
  );
}
