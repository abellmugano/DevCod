import { IconLock, IconCoins, IconScale, IconShield, IconCode, IconEye } from "./icons";

export function Differentials() {
  const items = [
    {
      icon: IconEye,
      title: "Auditoria forense",
      desc: "Hash-chain + HMAC em cada decisão. Rastreável por anos.",
    },
    {
      icon: IconCoins,
      title: "DevCoins cooperativistas",
      desc: "Contribua para a plataforma, ganhe prioridade em desafios e reduza taxas.",
    },
    {
      icon: IconScale,
      title: "Disputas com comitê",
      desc: "Contestação transparente com 3 membros, quórum 2/3 e prazo máximo de 7 dias.",
    },
    {
      icon: IconLock,
      title: "Zero-Trust",
      desc: "HMAC em webhooks, JWT em APIs, RLS aplicado às tabelas críticas. Segurança por padrão.",
    },
    {
      icon: IconCode,
      title: "100% open source",
      desc: "Código-fonte sob licença AGPL-3.0. Auditável por qualquer pessoa, a qualquer momento.",
    },
    {
      icon: IconShield,
      title: "Foco em setor crítico",
      desc: "Govtech, regtech, healthtech — onde a rastreabilidade não é opcional.",
    },
  ];

  return (
    <section id="diferenciais" className="py-20 md:py-28 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-16">
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Diferenciais
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-3 mb-4">
            Por que o DevCod é diferente
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Combinação única de elementos que nenhum concorrente oferece juntos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((it) => (
            <div
              key={it.title}
              className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-6 hover:border-blue-300 dark:hover:border-blue-800 transition-colors"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 mb-4">
                <it.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{it.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
