import Link from 'next/link'

export default function Post3() {
  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/blog" className="text-blue-400 hover:underline">← Все статьи</Link>
        <p className="text-sm text-gray-500 mt-4">2025-05-01</p>
        <h1 className="text-3xl font-bold mt-2 mb-6">Как перестать тильтовать за 5 шагов</h1>
        <div className="text-gray-300 leading-relaxed space-y-4">
          <p>Тильт крадёт твой ELO. Вот 5 техник, чтобы вернуть контроль.</p>
          <ol className="list-decimal pl-6 space-y-3">
            <li><strong>Дыши.</strong> 4 секунды вдох, 7 задержка, 8 выдох.</li>
            <li><strong>Встань.</strong> Пройдись 30 секунд, выпей воды.</li>
            <li><strong>Скажи стоп.</strong> Произнеси вслух: «Я контролирую эмоции».</li>
            <li><strong>Посмотри демку.</strong> Через 10 минут после игры — без эмоций.</li>
            <li><strong>Используй Ufuture.</strong> Бот отслеживает настроение и подсказывает, когда пора сделать паузу.</li>
          </ol>
        </div>
        <div className="mt-10 p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl text-center">
          <p className="text-lg font-semibold mb-2">Узнай свой потенциал ELO</p>
          <Link href="/" className="inline-block px-6 py-2 bg-blue-500 rounded-xl font-semibold">AI-чекап</Link>
        </div>
      </div>
    </main>
  )
}
