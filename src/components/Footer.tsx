import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 py-12 bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-lg font-bold tracking-tight mb-3">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-blue-600 text-white text-sm font-bold">
                D
              </span>
              DevCod
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm leading-relaxed">
              Plataforma freelancer open source com auditoria forense e Impact Score auditável.
            </p>
          </div>

          <div>
            <div className="text-sm font-semibold mb-4">Produto</div>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link href="/#como-funciona" className="hover:text-black dark:hover:text-white transition-colors">Como funciona</Link></li>
              <li><Link href="/#impact-score" className="hover:text-black dark:hover:text-white transition-colors">Impact Score</Link></li>
              <li><Link href="/#diferenciais" className="hover:text-black dark:hover:text-white transition-colors">Diferenciais</Link></li>
              <li><Link href="/waitlist" className="hover:text-black dark:hover:text-white transition-colors">Lista de espera</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold mb-4">Projeto</div>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <a href="https://github.com/abellmugano/DevCod" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://github.com/abellmugano/DevCod/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white transition-colors">
                  Licença AGPL-3.0
                </a>
              </li>
              <li>
                <a href="https://github.com/abellmugano/DevCod/blob/main/docs/adr-001-inicial.md" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white transition-colors">
                  Arquitetura (ADR-001)
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-xs text-gray-500">
            © 2026 DevCod · Licença AGPL-3.0
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Infraestrutura validada · Gate 4.9
          </div>
        </div>
      </div>
    </footer>
  );
}
