import Link from "next/link";
import { AuthButton } from "./AuthButton";
import { IconGitHub } from "./icons";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200/60 dark:border-gray-800/60">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3.5">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-blue-600 text-white text-sm font-bold">
            D
          </span>
          DevCod
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/#como-funciona" className="text-sm text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors">
            Como funciona
          </Link>
          <Link href="/#impact-score" className="text-sm text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors">
            Impact Score
          </Link>
          <Link href="/#diferenciais" className="text-sm text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors">
            Diferenciais
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/abellmugano/DevCod"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
            aria-label="Ver no GitHub"
          >
            <IconGitHub className="w-4 h-4" />
            GitHub
          </a>
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
