import Link from "next/link";
import { IconArrowRight, IconGitHub } from "./icons";

const chain = ["ISSUE", "CONTRIBUTION", "EVIDENCE", "VALIDATION", "REPUTATION"];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 pt-32 pb-20 lg:pt-44 lg:pb-28">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.045)_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="relative mx-auto grid max-w-7xl gap-16 px-5 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-8">
        <div>
          <p className="mb-7 font-mono text-[11px] uppercase tracking-[0.2em] text-[#b6ff45]">DEVCOD / CONTRIBUTION VERIFICATION INFRASTRUCTURE</p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[.98] tracking-[-.055em] text-white sm:text-7xl lg:text-[6.2rem]">Não movemos dinheiro.<br /><span className="text-[#b6ff45]">Movemos confiança.</span></h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-slate-400">Transforme trabalho técnico verificável em evidência, validação e reputação.</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href="https://github.com/abellmugano/DevCod" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 bg-[#b6ff45] px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-[#070908] transition hover:bg-white"><IconGitHub className="h-4 w-4" />Explorar no GitHub</a>
            <Link href="#como-funciona" className="inline-flex items-center justify-center gap-3 border border-white/20 px-5 py-3 font-mono text-xs uppercase tracking-[0.12em] text-white transition hover:border-[#b6ff45] hover:text-[#b6ff45]">Ver como funciona <IconArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
        <div className="border border-white/15 bg-[#0d110e] p-5 shadow-2xl shadow-black/30">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500"><span>VERIFICATION / PIPELINE</span><span className="text-[#b6ff45]">● EXPERIMENTAL</span></div>
          <div className="space-y-0 py-6">{chain.map((item, index) => <div key={item} className="flex items-center gap-4"><span className="w-6 font-mono text-[10px] text-slate-600">0{index + 1}</span><div className={`flex-1 border px-4 py-3 font-mono text-xs tracking-[0.18em] ${index === chain.length - 1 ? "border-[#b6ff45]/60 bg-[#b6ff45]/10 text-[#b6ff45]" : "border-white/10 text-slate-300"}`}>{item}</div>{index < chain.length - 1 && <span className="absolute ml-[2.35rem] mt-[4.5rem] text-[#b6ff45]">↓</span>}</div>)}</div>
          <div className="border-t border-white/10 pt-4 font-mono text-[10px] leading-5 text-slate-500">// Cada conclusão deve deixar uma trilha.<br />// Dados conceptuais. Sistema em desenvolvimento.</div>
        </div>
      </div>
    </section>
  );
}
