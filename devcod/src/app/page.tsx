import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-400">
            devcod
          </Link>
          <div className="flex items-center gap-6">
            <Link href="#features" className="hover:text-blue-400 transition-colors">
              Recursos
            </Link>
            <Link href="#challenges" className="hover:text-blue-400 transition-colors">
              Desafios
            </Link>
            <Link
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Participe de Desafios de{' '}
          <span className="text-blue-400">Programação</span>
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Mostre suas habilidades, resolva desafios reais e ganhe recompensas.
          Conecte-se com empresas e desenvolvedores do mundo todo.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
          >
            Começar Agora
          </Link>
          <Link
            href="#features"
            className="border border-gray-600 hover:border-blue-400 px-8 py-3 rounded-lg text-lg transition-colors"
          >
            Saber Mais
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Recursos</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="text-blue-400 text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold mb-2">Desafios Reais</h3>
            <p className="text-gray-400">
              Resolva problemas do mundo real propostos por empresas parceiras.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="text-blue-400 text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold mb-2">Recompensas</h3>
            <p className="text-gray-400">
              Ganhe prêmios em dinheiro pelas suas soluções aprovadas.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="text-blue-400 text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Avaliação Automática</h3>
            <p className="text-gray-400">
              Sistema inteligente de pontuação baseado em qualidade de código.
            </p>
          </div>
        </div>
      </section>

      {/* Challenges Preview */}
      <section id="challenges" className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Desafios em Destaque</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'API RESTful', difficulty: 'Fácil', reward: 'R$ 500' },
            { title: 'Sistema de Autenticação', difficulty: 'Médio', reward: 'R$ 1.200' },
            { title: 'Microserviços', difficulty: 'Difícil', reward: 'R$ 3.000' },
          ].map((challenge, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">{challenge.title}</h3>
              <div className="flex justify-between items-center mt-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    challenge.difficulty === 'Fácil'
                      ? 'bg-green-600'
                      : challenge.difficulty === 'Médio'
                      ? 'bg-yellow-600'
                      : 'bg-red-600'
                  }`}
                >
                  {challenge.difficulty}
                </span>
                <span className="text-blue-400 font-semibold">{challenge.reward}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              © 2024 devcod. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-blue-400">
                Termos
              </Link>
              <Link href="#" className="text-gray-400 hover:text-blue-400">
                Privacidade
              </Link>
              <Link href="#" className="text-gray-400 hover:text-blue-400">
                Contato
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
