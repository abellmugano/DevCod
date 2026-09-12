import { IconClock, IconEye, IconShield } from "./icons";

export function Problem() {
  const problems = [
    {
      icon: IconClock,
      title: "Issues críticas paradas",
      desc: "Funcionalidades essenciais ficam meses sem solução porque ninguém é remunerado pelo trabalho.",
    },
    {
      icon: IconEye,
      title: "Trabalho invisível",
      desc: "Devs contribuem gratuitamente e não conseguem construir portfólio verificável de impacto real.",
    },
    {
      icon: IconShield,
      title: "Falta de auditoria",
      desc: "Governos e empresas precisam de rastreabilidade, mas plataformas atuais não oferecem garantias.",
    },
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-16">
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            O problema
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-3 mb-4">
            Open source está quebrado
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            O modelo atual depende de voluntários heroicos. Não escala, não remunera, não audita.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 mb-4">
                <p.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{p.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
