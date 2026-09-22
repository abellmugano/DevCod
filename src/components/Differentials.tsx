const items = [
  { code: "TRACE", title: "Rastreabilidade por desenho", desc: "A ligação entre issue, contribuição e evidência permanece visível para revisão." },
  { code: "RULES", title: "Critérios explícitos", desc: "A validação parte de regras e critérios que podem ser compreendidos." },
  { code: "CONTEXT", title: "Contexto preservado", desc: "Artefactos e decisões não aparecem isolados do trabalho que lhes deu origem." },
  { code: "OPEN", title: "Código aberto", desc: "O projecto experimental pode ser inspeccionado através do seu repositório." },
  { code: "REVIEW", title: "Revisão humana", desc: "A infraestrutura organiza evidência; não substitui o julgamento de quem revê." },
  { code: "STATUS", title: "Em desenvolvimento", desc: "A proposta é experimental e deve ser avaliada antes de qualquer integração." },
];

export function Differentials() {
  return (
    <section id="diferenciais" className="border-b border-white/10 bg-[#070908] py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-16 max-w-2xl">
          <p className="eyebrow">03 / DIFFERENTIALS</p>
          <h2 className="section-title">Uma camada técnica<br /><span className="text-slate-500">para tornar o trabalho legível.</span></h2>
        </div>
        <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <article key={item.code} className="bg-[#0d110e] p-6 transition hover:bg-[#101610]">
              <div className="mb-12 flex justify-between font-mono text-[10px] text-slate-600"><span>0{index + 1}</span><span className="text-[#b6ff45]">{item.code}</span></div>
              <h3 className="text-lg font-medium text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-500">{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
