'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Target, Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'

function HighlightsSection({ nickname, currentElo }: { nickname: string; currentElo: number }) {
  const [highlights, setHighlights] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [mapName, setMapName] = useState('')
  const [likesMap, setLikesMap] = useState<Record<number, number>>({})
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/highlights?nickname=${encodeURIComponent(nickname)}`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setHighlights(data) })
      .catch(() => {})
  }, [nickname])

  useEffect(() => {
    highlights.forEach((h: any) => {
      fetch(`/api/likes?highlight_id=${h.id}`)
        .then(r => r.json())
        .then(d => setLikesMap(prev => ({ ...prev, [h.id]: d.likes || 0 })))
        .catch(() => {})
    })
  }, [highlights])

  const handleAdd = async () => {
    if (!title || !videoUrl) return
    await fetch('/api/highlights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickname, title, video_url: videoUrl, map_name: mapName || 'Unknown', type: 'highlight', elo_snapshot: currentElo })
    })
    setTitle(''); setVideoUrl(''); setMapName('')
    const res = await fetch(`/api/highlights?nickname=${encodeURIComponent(nickname)}`)
    const data = await res.json()
    if (Array.isArray(data)) setHighlights(data)
  }

  const handleLike = async (highlightId: number) => {
    const nick = localStorage.getItem('currentNickname')
    if (!nick) { alert('Войди в кабинет'); return }
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
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Название (например, Клатч 1v3)" className="px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm flex-1 min-w-[200px]" />
        <input value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="Ссылка на видео" className="px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm flex-1 min-w-[200px]" />
        <input value={mapName} onChange={e => setMapName(e.target.value)} placeholder="Карта (Mirage и т.д.)" className="px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm w-[150px]" />
        <button onClick={handleAdd} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold text-sm">Добавить</button>
      </div>
      {highlights.length === 0 ? (
        <p className="text-gray-500 text-sm">Пока нет хайлайтов. Добавь свой первый момент!</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {highlights.map(h => {
            const thumb = getThumbnail(h.video_url)
            return (
              <div key={h.id} className="bg-gray-900/50 rounded-xl overflow-hidden">
                <div
                  className="aspect-video bg-gray-900 flex items-center justify-center cursor-pointer relative"
                  onClick={() => setSelectedVideo(h.video_url)}
                >
                  {thumb ? (
                    <img src={thumb} alt={h.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl">▶️</span>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-semibold text-sm truncate">{h.title}</p>
                  <p className="text-xs text-gray-500">{h.map_name} · ELO {h.elo_snapshot}</p>
                  <div className="flex items-center justify-between mt-2">
                    <a href={h.video_url} target="_blank" className="text-blue-400 text-xs hover:underline">Смотреть →</a>
                    <button onClick={() => handleLike(h.id)} className="text-red-400 text-xs hover:text-red-300">
                      ❤️ {likesMap[h.id] || 0}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {selectedVideo && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6" onClick={() => setSelectedVideo(null)}>
          <div className="relative w-full max-w-4xl aspect-video" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedVideo(null)} className="absolute -top-10 right-0 text-white text-2xl hover:text-gray-300">✕</button>
            <iframe src={selectedVideo.replace('watch?v=', 'embed/')} className="w-full h-full rounded-xl" allowFullScreen />
          </div>
        </div>
      )}
    </div>
  )
}