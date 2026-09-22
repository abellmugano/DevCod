import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DevCod — Verificação de trabalho técnico",
  description:
    "Infraestrutura experimental para transformar trabalho técnico em evidência, validação e reputação baseada em confiança verificável.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-PT" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="bg-background text-on-surface font-body-md antialiased">
        {children}
      </body>
    </html>
  );
}
