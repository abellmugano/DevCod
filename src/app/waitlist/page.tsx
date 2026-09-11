import { Navbar } from "@/components/Navbar";
import { WaitlistForm } from "@/components/WaitlistForm";

export const metadata = {
  title: "Lista de Espera — DevCod",
  description: "Entre na lista de espera e seja avisado quando abrirmos os primeiros desafios.",
};

export default function WaitlistPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen">
        <section className="max-w-3xl mx-auto px-6 py-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Entre na lista de espera</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
            Seja avisado quando os primeiros desafios abrirem. Sem spam — apenas o anúncio de lançamento.
          </p>
          <WaitlistForm />
        </section>
      </main>
    </>
  );
}
