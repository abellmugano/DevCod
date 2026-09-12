import { WaitlistForm } from "./WaitlistForm";

export function FinalCTA() {
  return (
    <section className="py-20 md:py-28 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
          Pronto para começar?
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-10">
          Entre na lista e seja avisado quando os primeiros desafios abrirem.
        </p>
        <div className="flex justify-center">
          <WaitlistForm compact />
        </div>
        <p className="mt-6 text-xs text-gray-500">
          Sem spam. Apenas o anúncio de lançamento.
        </p>
      </div>
    </section>
  );
}
