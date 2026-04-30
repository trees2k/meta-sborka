import Link from 'next/link'

export default function Post2() {
  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/blog" className="text-blue-400 hover:underline">← Все статьи</Link>
        <p className="text-sm text-gray-500 mt-4">2025-05-01</p>
        <h1 className="text-3xl font-bold mt-2 mb-6">Сон и реакция геймера: исследование</h1>
        <div className="text-gray-300 leading-relaxed space-y-4">
          <p>Сон — это главный буст для твоего рейтинга.</p>
          <h2 className="text-xl font-semibold mt-6">Цифры</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>6 часов сна → реакция на 15% медленнее.</li>
            <li>7–8 часов → пиковая Accuracy.</li>
            <li>Меньше 5 часов → винрейт падает на 20%+.</li>
          </ul>
          <h2 className="text-xl font-semibold mt-6">Как улучшить сон</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Ложись в одно и то же время.</li>
            <li>Убери телефон за 30 минут до сна.</li>
            <li>Не играй прямо перед сном — адреналин мешает заснуть.</li>
          </ol>
          <p>Наш бот спрашивает о сне каждый день, а AI-коуч даёт рекомендации.</p>
        </div>
        <div className="mt-10 p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl text-center">
          <p className="text-lg font-semibold mb-2">Узнай свой потенциал ELO</p>
          <Link href="/" className="inline-block px-6 py-2 bg-blue-500 rounded-xl font-semibold">AI-чекап</Link>
        </div>
      </div>
    </main>
  )
}