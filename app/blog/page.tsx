import Link from 'next/link'

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Блог Ufuture</h1>
        <p className="text-gray-400 mb-8">AI-аналитика, сон, тильт и киберспорт.</p>
        <div className="space-y-6">
          <Link href="/blog/pochemu-vinreyt-padaet-posle-22" className="block bg-gray-800/50 rounded-2xl p-6 hover:bg-gray-800">
            <p className="text-sm text-gray-500">2025-05-01</p>
            <h2 className="text-xl font-semibold mt-1">Почему твой винрейт падает после 22:00</h2>
            <p className="text-gray-400 mt-2">Разбираем на данных, как время суток влияет на точность и K/D.</p>
          </Link>
          <Link href="/blog/son-i-reaktsiya-geymera" className="block bg-gray-800/50 rounded-2xl p-6 hover:bg-gray-800">
            <p className="text-sm text-gray-500">2025-05-01</p>
            <h2 className="text-xl font-semibold mt-1">Сон и реакция геймера: исследование</h2>
            <p className="text-gray-400 mt-2">Сколько нужно спать, чтобы Accuracy выросла на 15%.</p>
          </Link>
          <Link href="/blog/kak-perestat-tiltovat" className="block bg-gray-800/50 rounded-2xl p-6 hover:bg-gray-800">
            <p className="text-sm text-gray-500">2025-05-01</p>
            <h2 className="text-xl font-semibold mt-1">Как перестать тильтовать за 5 шагов</h2>
            <p className="text-gray-400 mt-2">Практические техники от киберспортивных психологов.</p>
          </Link>
        </div>
      </div>
    </main>
  )
}