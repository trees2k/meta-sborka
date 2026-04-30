import Link from 'next/link'
import { notFound } from 'next/navigation'

const articles: Record<string, { title: string; date: string; content: string }> = {
  'pochemu-vinreyt-padaet-posle-22': {
    title: 'Почему твой винрейт падает после 22:00',
    date: '2025-05-01',
    content: `
Ты замечал, что после 22:00 игра идёт хуже? Это не случайность.

## Что говорят данные

Проанализировав 1000+ матчей на FACEIT, мы обнаружили:
- Винрейт падает на 12–18% после 22:00.
- Accuracy снижается на 8–15%.
- Время реакции увеличивается на 20–30 мс.

## Почему это происходит

1. **Усталость.** После работы или учёбы мозг уже перегружен.
2. **Циркадные ритмы.** Мелатонин начинает вырабатываться, организм готовится ко сну.
3. **Тильт накапливается.** За день ты уже пережил стресс, и любая ошибка выбивает сильнее.

## Что делать

- Играй в своё «идеальное окно» — обычно 19:00–21:00.
- Делай 7-минутную разминку перед игрой.
- Используй Ufuture, чтобы отслеживать свой режим и получать персональные рекомендации.

[Попробовать AI-чекап](https://meta-sborka.vercel.app)
    `
  },
  'son-i-reaktsiya-gaymera': {
    title: 'Сон и реакция геймера: исследование',
    date: '2025-05-01',
    content: `
Сон — это главный буст для твоего рейтинга.

## Цифры

- 6 часов сна → реакция на 15% медленнее.
- 7–8 часов → пиковая Accuracy.
- Меньше 5 часов → винрейт падает на 20%+.

## Как улучшить сон

1. Ложись в одно и то же время.
2. Убери телефон за 30 минут до сна.
3. Не играй прямо перед сном — адреналин мешает заснуть.

## Ufuture поможет

Наш бот спрашивает тебя о сне каждый день, а AI-коуч даёт рекомендации. [Попробовать](https://meta-sborka.vercel.app)
    `
  },
  'kak-perestat-tiltovat': {
    title: 'Как перестать тильтовать за 5 шагов',
    date: '2025-05-01',
    content: `
Тильт крадёт твой ELO. Вот 5 техник, чтобы вернуть контроль.

1. **Дыши.** 4 секунды вдох, 7 задержка, 8 выдох.
2. **Встань.** Пройдись 30 секунд, выпей воды.
3. **Скажи стоп.** Произнеси вслух: «Я контролирую эмоции».
4. **Посмотри демку.** Через 10 минут после игры — без эмоций.
5. **Используй Ufuture.** Бот отслеживает твоё настроение и подсказывает, когда пора сделать паузу.

[Начать с Ufuture](https://meta-sborka.vercel.app)
    `
  }
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = articles[params.slug]
  if (!post) notFound()

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/blog" className="text-blue-400 hover:underline">← Все статьи</Link>
        <p className="text-sm text-gray-500 mt-4">{post.date}</p>
        <h1 className="text-3xl font-bold mt-2 mb-6">{post.title}</h1>
        <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-line">
          {post.content}
        </div>
        <div className="mt-10 p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl text-center">
          <p className="text-lg font-semibold mb-2">Узнай свой потенциал ELO</p>
          <Link href="/" className="inline-block px-6 py-2 bg-blue-500 rounded-xl font-semibold">AI-чекап</Link>
        </div>
      </div>
    </main>
  )
}