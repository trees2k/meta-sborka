'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function HighlightsFeed() {
  const [highlights, setHighlights] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('new')
  const [mapFilter, setMapFilter] = useState('')

  useEffect(() => {
    fetchHighlights()
  }, [sort])

  const fetchHighlights = async () => {
    setLoading(true)
    const res = await fetch('/api/highlights?limit=50')
    const data = await res.json()
    if (Array.isArray(data)) {
      let sorted = data
      if (sort === 'popular') sorted = data.sort((a: any, b: any) => (b.likes || 0) - (a.likes || 0))
      if (sort === 'elo') sorted = data.sort((a: any, b: any) => (b.elo_snapshot || 0) - (a.elo_snapshot || 0))
      if (mapFilter) sorted = sorted.filter((h: any) => h.map_name?.toLowerCase().includes(mapFilter.toLowerCase()))
      setHighlights(sorted)
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-blue-400 hover:underline text-sm">← На главную</Link>
        <h1 className="text-4xl font-bold mt-4 mb-2">🎬 Лента хайлайтов</h1>
        <p className="text-gray-400 mb-6">Лучшие моменты игроков Ufuture</p>

        {/* Фильтры */}
        <div className="flex gap-3 mb-8 flex-wrap">
          <button onClick={() => setSort('new')} className={`px-4 py-2 rounded-xl text-sm font-semibold ${sort === 'new' ? 'bg-blue-500' : 'bg-gray-800'}`}>
            Новые
          </button>
          <button onClick={() => setSort('popular')} className={`px-4 py-2 rounded-xl text-sm font-semibold ${sort === 'popular' ? 'bg-blue-500' : 'bg-gray-800'}`}>
            Популярные
          </button>
          <button onClick={() => setSort('elo')} className={`px-4 py-2 rounded-xl text-sm font-semibold ${sort === 'elo' ? 'bg-blue-500' : 'bg-gray-800'}`}>
            По ELO
          </button>
          <input
            value={mapFilter}
            onChange={e => { setMapFilter(e.target.value); fetchHighlights() }}
            placeholder="Карта (Mirage, Inferno...)"
            className="px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm w-[200px]"
          />
        </div>

        {loading ? (
          <p className="text-center py-20">Загрузка...</p>
        ) : highlights.length === 0 ? (
          <p className="text-center py-20 text-gray-500">Пока нет хайлайтов. Будь первым — добавь момент в своём кабинете!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map(h => (
              <div key={h.id} className="bg-gray-800/50 rounded-2xl overflow-hidden hover:bg-gray-800 transition-all group">
                <div className="aspect-video bg-gray-900 flex items-center justify-center">
                  <a href={h.video_url} target="_blank" className="text-4xl">▶️</a>
                </div>
                <div className="p-4">
                  <p className="font-semibold truncate">{h.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Link href={`/profile/${h.nickname}`} className="text-blue-400 text-sm hover:underline">{h.nickname}</Link>
                    <span className="text-gray-500 text-xs">{h.elo_snapshot} ELO</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span>{h.map_name}</span>
                    <span>{new Date(h.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}