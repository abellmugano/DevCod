import Link from "next/link";
import { WaitlistForm } from "./WaitlistForm";
import { IconArrowRight, IconGitHub } from "./icons";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Coluna esquerda: texto */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 mb-6">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              MVP em desenvolvimento · Core Isolado validado
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-6">
              Onde código aberto encontra{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                recompensa justa
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              Plataforma freelancer que remunera contribuições open source com auditoria
              forense e Impact Score objetivo. Cada pagamento é rastreável, cada decisão é
              auditável.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Link
                href="/waitlist"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                Entrar na lista
                <IconArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://github.com/abellmugano/DevCod"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 px-6 py-3 font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                <IconGitHub className="w-4 h-4" />
                Ver GitHub
              </a>
            </div>

            <WaitlistForm compact />
          </div>

          {/* Coluna direita: mockup visual */}
          <div className="relative">
            <div className="relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-2xl shadow-blue-500/5 overflow-hidden">
              {/* Header do card */}
              <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-900 px-4 py-3">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-700" />
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-700" />
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-700" />
                <div className="ml-3 text-xs text-gray-500 font-mono">devcod / audit / trace-abc123</div>
              </div>

              {/* Conteúdo */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Impact Score</span>
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">✓ Verificado</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold tracking-tight">8.50</span>
                  <span className="text-lg text-gray-400">/ 10</span>
                </div>

                <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-gray-900">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Complexidade</span>
                    <span className="font-medium">9.0 × 0.35 = 3.15</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Qualidade</span>
                    <span className="font-medium">8.0 × 0.35 = 2.80</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Impacto</span>
                    <span className="font-medium">8.5 × 0.30 = 2.55</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-900">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Pagamento liberado</span>
                    <span className="text-xl font-bold text-green-600 dark:text-green-400">R$ 4.250 [EXEMPLO ILUSTRATIVO]</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-mono">sha256:4a7c2f... [EXEMPLO ILUSTRATIVO]</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card flutuante secundário */}
            <div className="absolute -bottom-6 -left-6 hidden md:block rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-xl p-4 w-48">
              <div className="text-xs text-gray-500 mb-1">DevCoins</div>
              <div className="text-2xl font-bold">+340 [EXEMPLO ILUSTRATIVO]</div>
              <div className="text-xs text-gray-500 mt-1">por esta contribuição</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
