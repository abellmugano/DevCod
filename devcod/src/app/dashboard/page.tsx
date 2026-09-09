import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-blue-400">
              devcod
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="text-blue-400">
                Dashboard
              </Link>
              <Link href="/dashboard/challenges" className="hover:text-blue-400 transition-colors">
                Desafios
              </Link>
              <Link href="/dashboard/submissions" className="hover:text-blue-400 transition-colors">
                Submissões
              </Link>
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="font-semibold">U</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <main className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <p className="text-gray-400 text-sm mb-2">Desafios Completados</p>
            <p className="text-3xl font-bold text-green-400">5</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <p className="text-gray-400 text-sm mb-2">Submissões Pendentes</p>
            <p className="text-3xl font-bold text-yellow-400">2</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <p className="text-gray-400 text-sm mb-2">Pontuação Média</p>
            <p className="text-3xl font-bold text-blue-400">78</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <p className="text-gray-400 text-sm mb-2">Total Ganho</p>
            <p className="text-3xl font-bold text-purple-400">R$ 4.200</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Atividade Recente</h2>
            <div className="space-y-4">
              {[
                { action: 'Submissão enviada', challenge: 'API RESTful', date: 'Hoje', status: 'pending' },
                { action: 'Desafio completado', challenge: 'Sistema de Auth', date: 'Ontem', status: 'accepted' },
                { action: 'Submissão revisada', challenge: 'Microserviços', date: '2 dias atrás', status: 'rejected' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-0">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-400">{activity.challenge}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        activity.status === 'accepted'
                          ? 'bg-green-600'
                          : activity.status === 'rejected'
                          ? 'bg-red-600'
                          : 'bg-yellow-600'
                      }`}
                    >
                      {activity.status === 'accepted' ? 'Aceito' : activity.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Available Challenges */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Desafios Disponíveis</h2>
            <div className="space-y-4">
              {[
                { title: 'E-commerce API', difficulty: 'Médio', reward: 'R$ 1.500', applicants: 23 },
                { title: 'Real-time Chat', difficulty: 'Difícil', reward: 'R$ 3.500', applicants: 12 },
                { title: 'Landing Page', difficulty: 'Fácil', reward: 'R$ 800', applicants: 45 },
              ].map((challenge, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-0">
                  <div>
                    <p className="font-medium">{challenge.title}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>{challenge.difficulty}</span>
                      <span>•</span>
                      <span>{challenge.applicants} inscritos</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-400 font-semibold">{challenge.reward}</p>
                    <Link
                      href={`/dashboard/challenges/${index}`}
                      className="text-sm text-blue-400 hover:underline"
                    >
                      Ver detalhes
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
          <div className="flex gap-4">
            <Link
              href="/dashboard/challenges"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors"
            >
              Explorar Desafios
            </Link>
            <Link
              href="/dashboard/submissions/new"
              className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg transition-colors"
            >
              Nova Submissão
            </Link>
            <Link
              href="/dashboard/profile"
              className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg transition-colors"
            >
              Editar Perfil
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
