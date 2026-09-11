"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Role = "dev" | "maintainer" | "enterprise" | "other";

export function WaitlistForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("dev");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const supabase = createClient();
    const { error } = await supabase.from("waitlist").insert({
      email: email.trim().toLowerCase(),
      role,
      source: "landing_page",
    });

    if (error) {
      if (error.code === "23505") {
        setStatus("success");
        setMessage("Você já está na lista!");
      } else {
        setStatus("error");
        setMessage("Erro ao inscrever. Tente novamente.");
      }
      return;
    }

    setStatus("success");
    setMessage("Inscrição confirmada! Avisaremos quando abrir.");
    setEmail("");
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-xl">
        <input
          type="email"
          required
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading" || status === "success"}
          className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="rounded-lg bg-blue-600 px-6 py-3 text-sm text-white font-medium hover:bg-blue-700 transition disabled:opacity-50"
        >
          {status === "loading" ? "Enviando..." : status === "success" ? "✓ Inscrito" : "Entrar na lista"}
        </button>
        {message && (
          <p className={`text-sm mt-2 sm:mt-0 sm:ml-3 ${status === "error" ? "text-red-600" : "text-green-600"}`}>
            {message}
          </p>
        )}
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading" || status === "success"}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label htmlFor="role" className="block text-sm font-medium mb-2">
          Você é
        </label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          disabled={status === "loading" || status === "success"}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="dev">Desenvolvedor</option>
          <option value="maintainer">Mantenedor de projeto</option>
          <option value="enterprise">Empresa / Órgão público</option>
          <option value="other">Outro</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={status === "loading" || status === "success"}
        className="w-full rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition disabled:opacity-50"
      >
        {status === "loading" ? "Enviando..." : status === "success" ? "✓ Inscrição confirmada" : "Entrar na lista"}
      </button>
      {message && (
        <p className={`text-sm ${status === "error" ? "text-red-600" : "text-green-600"}`}>
          {message}
        </p>
      )}
    </form>
  );
}
