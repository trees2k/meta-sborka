import Link from 'next/link'

const posts = [
  {
    slug: 'pochemu-vinreyt-padaet-posle-22',
    title: 'Почему твой винрейт падает после 22:00',
    date: '2025-05-01',
    excerpt: 'Разбираем на данных, как время суток влияет на точность и K/D.'
  },
  {
    slug: 'son-i-reaktsiya-gaymera',
    title: 'Сон и реакция геймера: исследование',
    date: '2025-05-01',
    excerpt: 'Сколько нужно спать, чтобы Accuracy выросла на 15%.'
  },
  {
    slug: 'kak-perestat-tiltovat',
    title: 'Как перестать тильтовать за 5 шагов',
    date: '2025-05-01',
    excerpt: 'Практические техники от киберспортивных психологов.'
  }
]

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Блог Ufuture</h1>
        <p className="text-gray-400 mb-8">AI-аналитика, сон, тильт и киберспорт.</p>
        <div className="space-y-6">
          {posts.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`}
              className="block bg-gray-800/50 rounded-2xl p-6 hover:bg-gray-800 transition-all">
              <p className="text-sm text-gray-500">{post.date}</p>
              <h2 className="text-xl font-semibold mt-1">{post.title}</h2>
              <p className="text-gray-400 mt-2">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}