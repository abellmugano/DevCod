import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Problem } from "@/components/Problem";
import { Solution } from "@/components/Solution";
import { Differentials } from "@/components/Differentials";
import { VerificationAttributes } from "@/components/VerificationAttributes";
import { ForWhom } from "@/components/ForWhom";
import { AuditTrailPreview } from "@/components/AuditTrailPreview";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "DevCod — Verificação de trabalho técnico",
  description: "Infraestrutura experimental para transformar trabalho técnico em evidência, validação e reputação baseada em confiança verificável.",
};

export default function Home() {
  return <div className="min-h-screen bg-[#070908] text-white"><Navbar /><main><Hero /><Problem /><Solution /><Differentials /><VerificationAttributes /><ForWhom /><AuditTrailPreview /><FinalCTA /></main><Footer /></div>;
}
