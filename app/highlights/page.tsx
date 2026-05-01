'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function HighlightsFeed() {
  const [highlights, setHighlights] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [likesMap, setLikesMap] = useState<Record<number, number>>({})
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  useEffect(() => {
    fetchHighlights()
  }, [])

  const fetchHighlights = async () => {
    setLoading(true)
    const res = await fetch('/api/highlights?limit=50')
    const data = await res.json()
    if (Array.isArray(data)) {
      setHighlights(data)
      data.forEach((h: any) => {
        fetch(`/api/likes?highlight_id=${h.id}`)
          .then(r => r.json())
          .then(d => setLikesMap(prev => ({ ...prev, [h.id]: d.likes || 0 })))
          .catch(() => {})
      })
    }
    setLoading(false)
  }

  const handleLike = async (highlightId: number) => {
    const nick = localStorage.getItem('currentNickname')
    if (!nick) { alert('Войди в кабинет, чтобы лайкать'); return }
    const res = await fetch('/api/likes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ highlight_id: highlightId, nickname: nick })
    })
    const data = await res.json()
    if (data.ok) setLikesMap(prev => ({ ...prev, [highlightId]: data.likes }))
  }

  const getThumbnail = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const id = url.match(/(?:v=|\/)([\w-]{11})/)?.[1]
      return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
    }
    if (url.includes('vimeo.com')) {
      const id = url.match(/vimeo\.com\/(\d+)/)?.[1]
      return id ? `https://vumbnail.com/${id}.jpg` : null
    }
    return null
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-blue-400 hover:underline text-sm">← На главную</Link>
        <h1 className="text-4xl font-bold mt-4 mb-6">🎬 Лента хайлайтов</h1>

        {loading ? (
          <p className="text-center py-20">Загрузка...</p>
        ) : highlights.length === 0 ? (
          <p className="text-center py-20 text-gray-500">Пока нет хайлайтов. Будь первым!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((h: any) => {
              const thumb = getThumbnail(h.video_url)
              return (
                <div key={h.id} className="bg-gray-800/50 rounded-2xl overflow-hidden hover:bg-gray-800 transition-all">
                  <div
                    className="aspect-video bg-gray-900 flex items-center justify-center cursor-pointer relative"
                    onClick={() => setSelectedVideo(h.video_url)}
                  >
                    {thumb ? (
                      <img src={thumb} alt={h.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl">▶️</span>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-5xl">▶️</span>
                    </div>
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
                      <button onClick={() => handleLike(h.id)} className="text-red-400 hover:text-red-300">❤️ {likesMap[h.id] || 0}</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Модальное окно с видео */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6" onClick={() => setSelectedVideo(null)}>
            <div className="relative w-full max-w-4xl aspect-video" onClick={e => e.stopPropagation()}>
              <button onClick={() => setSelectedVideo(null)} className="absolute -top-10 right-0 text-white text-2xl hover:text-gray-300">✕</button>
              <iframe
                src={selectedVideo.replace('watch?v=', 'embed/')}
                className="w-full h-full rounded-xl"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}