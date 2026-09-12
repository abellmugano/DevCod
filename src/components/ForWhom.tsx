export function ForWhom() {
  const personas = [
    {
      tag: "Para devs",
      title: "Construa portfólio. Receba por impacto.",
      desc: "Escolha desafios com recompensa, submeta PRs, receba pagamento proporcional ao Impact Score. Reputação verificável para o mercado.",
    },
    {
      tag: "Para projetos",
      title: "Resolva issues sem contratar CLT.",
      desc: "Publique desafios com metas mensuráveis. Pague apenas quando o PR for aprovado. Sem burocracia, sem contrato fixo.",
    },
    {
      tag: "Para empresas e governo",
      title: "Auditoria pronta para licitação.",
      desc: "Arquitetura preparada para requisitos de auditoria, LGPD e rastreabilidade governamental.",
    },
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-16">
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Para quem
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-3 mb-4">
            Feito para três perfis
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {personas.map((p) => (
            <div
              key={p.tag}
              className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-8 flex flex-col"
            >
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-4">
                {p.tag}
              </span>
              <h3 className="text-xl font-semibold mb-3 leading-tight">{p.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
