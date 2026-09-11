import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold">
          DevCod
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/projects" className="text-sm text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white">
            Projetos
          </Link>
          <Link href="/audit" className="text-sm text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white">
            Auditoria
          </Link>
          <Link href="/about" className="text-sm text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white">
            Sobre
          </Link>
          <Link
            href="/waitlist"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white font-medium hover:bg-blue-700 transition"
          >
            Entrar na lista
          </Link>
        </div>
        <Link
          href="/waitlist"
          className="md:hidden rounded-lg bg-blue-600 px-3 py-2 text-sm text-white font-medium"
        >
          Entrar
        </Link>
      </div>
    </nav>
  );
}
