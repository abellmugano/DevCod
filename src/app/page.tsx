import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { WaitlistForm } from "@/components/WaitlistForm";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="pt-20">
        {/* HERO */}
        <section className="max-w-6xl mx-auto px-6 py-20 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-block rounded-full bg-blue-100 dark:bg-blue-950 px-4 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 mb-6">
              Backend operacional · MVP em desenvolvimento
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Onde código aberto encontra <span className="text-blue-600">recompensa justa</span>.
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8">
              Plataforma freelancer que remunera contribuições open source com auditoria
              forense e Impact Score objetivo. Cada pagamento é rastreável, cada decisão é
              auditável.
            </p>
            <WaitlistForm compact />
          </div>
        </section>

        {/* PROBLEMA */}
        <section className="bg-gray-50 dark:bg-gray-950 py-20">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-12 text-center">O problema do open source</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-black">
                <div className="text-3xl mb-3">⏳</div>
                <h3 className="font-semibold mb-2">Issues críticas paradas</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Funcionalidades essenciais ficam meses sem solução porque ninguém é remunerado.
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-black">
                <div className="text-3xl mb-3">💸</div>
                <h3 className="font-semibold mb-2">Trabalho invisível</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Devs contribuem gratuitamente e não conseguem construir portfólio verificável.
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-black">
                <div className="text-3xl mb-3">🔍</div>
                <h3 className="font-semibold mb-2">Falta de auditoria</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Governos e empresas precisam de rastreabilidade, mas plataformas atuais não oferecem.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SOLUÇÃO */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-12 text-center">Como funciona</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white font-bold mb-4">
                  1
                </div>
                <h3 className="font-semibold mb-2">Projeto publica desafio</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Com metas mensuráveis, recompensa e prazo. Validação automática no ato.
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white font-bold mb-4">
                  2
                </div>
                <h3 className="font-semibold mb-2">Dev contribui</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Submete PR via GitHub. Métricas automáticas via CI/CD. Impact Score calculado.
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white font-bold mb-4">
                  3
                </div>
                <h3 className="font-semibold mb-2">Pagamento auditado</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Escrow libera proporcionalmente ao score. Event log registra tudo de forma imutável.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* DIFERENCIAIS */}
        <section className="bg-gray-50 dark:bg-gray-950 py-20">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-12 text-center">Por que o DevCod?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-black">
                <div className="text-2xl mb-3">📊</div>
                <h3 className="font-semibold mb-2">Impact Score objetivo</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Fórmula pública (60% automático + 40% humano). Sem caixa-preta, sem viés.
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-black">
                <div className="text-2xl mb-3">🔐</div>
                <h3 className="font-semibold mb-2">Auditoria forense</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Hash-chain + HMAC em cada decisão. Rastreável por anos, imutável por design.
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-black">
                <div className="text-2xl mb-3">💎</div>
                <h3 className="font-semibold mb-2">DevCoins cooperativistas</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Contribua para a plataforma, ganhe prioridade e reduza taxas.
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-black">
                <div className="text-2xl mb-3">⚖️</div>
                <h3 className="font-semibold mb-2">Disputas com comitê</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Contestação transparente com 3 membros, quorum 2/3 e prazo máximo de 7 dias.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-20">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Entre na lista de espera
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Vamos avisar quando abrirmos os primeiros desafios com recompensa.
            </p>
            <div className="flex justify-center">
              <WaitlistForm compact />
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-gray-200 dark:border-gray-800 py-12">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500">
              DevCod © 2026 · Licença AGPL-3.0
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/projects" className="text-gray-500 hover:text-black dark:hover:text-white">
                Projetos
              </Link>
              <Link href="/audit" className="text-gray-500 hover:text-black dark:hover:text-white">
                Auditoria
              </Link>
              <Link href="/about" className="text-gray-500 hover:text-black dark:hover:text-white">
                Sobre
              </Link>
              <a
                href="https://github.com/abellmugano/DevCod"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-black dark:hover:text-white"
              >
                GitHub
              </a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
