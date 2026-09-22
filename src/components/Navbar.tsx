import Link from "next/link";
import { AuthButton } from "./AuthButton";

export function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#070908]/90 backdrop-blur" aria-label="Navegação principal">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="DevCod, início">
          <span className="flex h-8 w-8 items-center justify-center border border-[#b6ff45] font-mono text-sm font-bold text-[#b6ff45]">D_</span>
          <span className="text-lg font-semibold tracking-tight text-white">DevCod<span className="text-[#b6ff45]">.</span></span>
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <Link href="/#como-funciona" className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-400 transition hover:text-white">Como funciona</Link>
          <Link href="/#verificacao" className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-400 transition hover:text-white">Verificação</Link>
          <Link href="/#para-quem" className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-400 transition hover:text-white">Para quem</Link>
        </div>
        <AuthButton />
      </div>
    </nav>
  );
}
