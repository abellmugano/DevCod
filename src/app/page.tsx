import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { Problem } from "@/components/Problem";
import { Solution } from "@/components/Solution";
import { ImpactScore } from "@/components/ImpactScore";
import { Differentials } from "@/components/Differentials";
import { ForWhom } from "@/components/ForWhom";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "DevCod — Onde código aberto encontra recompensa justa",
  description:
    "Plataforma freelancer open source com auditoria forense, Impact Score objetivo e pagamentos rastreáveis via escrow.",
};

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <Problem />
        <Solution />
        <ImpactScore />
        <Differentials />
        <ForWhom />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}