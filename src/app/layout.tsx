import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevCod — Onde código aberto encontra recompensa justa",
  description: "Plataforma freelancer open source com Impact Score auditável.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
