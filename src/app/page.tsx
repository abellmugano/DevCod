export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold mb-6">DevCod</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Onde código aberto encontra recompensa justa.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/waitlist"
            className="rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition"
          >
            Entrar na lista
          </a>
          <a
            href="/projects"
            className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            Ver projetos
          </a>
        </div>
        <p className="mt-12 text-sm text-gray-500">
          Status: MVP em desenvolvimento · Backend operacional ✅
        </p>
      </div>
    </main>
  );
}
