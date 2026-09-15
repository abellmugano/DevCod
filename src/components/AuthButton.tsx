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
        <a href="/dashboard" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
          Dashboard
        </a>
        <button
          onClick={handleLogout}
          className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
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
      className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
    >
      Entrar com GitHub
    </a>
  );
}