import Link from 'next/link'

export default function Post1() {
  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/blog" className="text-blue-400 hover:underline">← Все статьи</Link>
        <p className="text-sm text-gray-500 mt-4">2025-05-01</p>
        <h1 className="text-3xl font-bold mt-2 mb-6">Почему твой винрейт падает после 22:00</h1>
        <div className="text-gray-300 leading-relaxed space-y-4">
          <p>Ты замечал, что после 22:00 игра идёт хуже? Это не случайность.</p>
          <h2 className="text-xl font-semibold mt-6">Что говорят данные</h2>
          <p>Проанализировав 1000+ матчей на FACEIT, мы обнаружили:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Винрейт падает на 12–18% после 22:00.</li>
            <li>Accuracy снижается на 8–15%.</li>
            <li>Время реакции увеличивается на 20–30 мс.</li>
          </ul>
          <h2 className="text-xl font-semibold mt-6">Почему это происходит</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li><strong>Усталость.</strong> После работы или учёбы мозг уже перегружен.</li>
            <li><strong>Циркадные ритмы.</strong> Мелатонин начинает вырабатываться.</li>
            <li><strong>Тильт накапливается.</strong> За день ты уже пережил стресс.</li>
          </ol>
          <h2 className="text-xl font-semibold mt-6">Что делать</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Играй в своё «идеальное окно» — обычно 19:00–21:00.</li>
            <li>Делай 7-минутную разминку перед игрой.</li>
            <li>Используй Ufuture, чтобы отслеживать режим.</li>
          </ul>
        </div>
        <div className="mt-10 p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl text-center">
          <p className="text-lg font-semibold mb-2">Узнай свой потенциал ELO</p>
          <Link href="/" className="inline-block px-6 py-2 bg-blue-500 rounded-xl font-semibold">AI-чекап</Link>
        </div>
      </div>
    </main>
  )
}
