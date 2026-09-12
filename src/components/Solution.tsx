export function Solution() {
  const steps = [
    {
      n: "01",
      title: "Projeto publica desafio",
      desc: "Com metas mensuráveis, recompensa em escrow e prazo definido. Validação automática no ato da criação.",
    },
    {
      n: "02",
      title: "Dev contribui e submete PR",
      desc: "Métricas coletadas automaticamente via CI/CD. Mantenedor avalia os critérios subjetivos (40% do score).",
    },
    {
      n: "03",
      title: "Pagamento auditado",
      desc: "Escrow libera proporcionalmente ao Impact Score. Event log registra cada decisão com rastreabilidade auditável.",
    },
  ];

  return (
    <section id="como-funciona" className="py-20 md:py-28 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-16">
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            A solução
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-3 mb-4">
            Como o DevCod resolve
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Três passos, cada um com garantias técnicas verificáveis.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {steps.map((s) => (
            <div key={s.n} className="relative">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {s.n}
                </span>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
