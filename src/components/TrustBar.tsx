export function TrustBar() {
  return (
    <section className="border-y border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center text-xs uppercase tracking-widest text-gray-500 mb-6">
          Construído sobre infraestrutura confiável
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-60">
          <span className="text-lg font-semibold tracking-tight">GitHub</span>
          <span className="text-lg font-semibold tracking-tight">Stripe</span>
          <span className="text-lg font-semibold tracking-tight">Supabase</span>
          <span className="text-lg font-semibold tracking-tight">Next.js</span>
          <span className="text-lg font-semibold tracking-tight">PostgreSQL</span>
        </div>
      </div>
    </section>
  );
}
