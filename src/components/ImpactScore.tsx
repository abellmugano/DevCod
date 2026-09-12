import { IconCheck } from "./icons";

export function ImpactScore() {
  const bullets = [
    "Pesos mínimos obrigatórios por categoria (impede gamificação)",
    "Fórmula versionada e auditável publicamente",
    "Cada cálculo registrado com rastreabilidade auditável",
    "Métricas automáticas coletadas via CI/CD do GitHub",
  ];

  return (
    <section id="impact-score" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Fórmula visual */}
          <div>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Transparência algorítmica
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-3 mb-6">
              Impact Score
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              A fórmula é pública, versionada e auditável. Sem caixa-preta, sem viés oculto.
            </p>

            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 p-6 font-mono text-sm">
              <div className="text-gray-500 mb-2">// score_v1</div>
              <div className="text-blue-600 dark:text-blue-400">
                score = (complexidade × 0.35) + (qualidade × 0.35) + (impacto × 0.30)
              </div>
            </div>
          </div>

          {/* Explicação */}
          <div>
            <ul className="space-y-4">
              {bullets.map((b) => (
                <li key={b} className="flex gap-3">
                  <span className="mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shrink-0">
                    <IconCheck className="w-3 h-3" />
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
