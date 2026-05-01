'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function ProfileContent() {
  const searchParams = useSearchParams()
  const nickname = searchParams.get('nickname') || ''
  const [player, setPlayer] = useState<any>(null)
  const [highlights, setHighlights] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [likesMap, setLikesMap] = useState<Record<number, number>>({})
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [followersCount, setFollowersCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    if (!nickname) return
    setLoading(true)
    fetch(`/api/faceit?nickname=${encodeURIComponent(nickname)}`)
      .then(r => r.json())
      .then(data => { if (!data.error) setPlayer(data) })
      .catch(() => {})
    fetch(`/api/highlights?nickname=${encodeURIComponent(nickname)}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setHighlights(data)
          data.forEach((h: any) => {
            fetch(`/api/likes?highlight_id=${h.id}`)
              .then(r => r.json())
              .then(d => setLikesMap(prev => ({ ...prev, [h.id]: d.likes || 0 })))
              .catch(() => {})
          })
        }
      })
      .catch(() => {})
    fetch(`/api/follow?nickname=${encodeURIComponent(nickname)}&type=followers`)
      .then(r => r.json()).then(d => setFollowersCount(d.count || 0)).catch(() => {})
    fetch(`/api/follow?nickname=${encodeURIComponent(nickname)}&type=following`)
      .then(r => r.json()).then(d => setFollowingCount(d.count || 0)).catch(() => {})
    setLoading(false)
  }, [nickname])

  const getThumbnail = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const id = url.match(/(?:v=|\/)([\w-]{11})/)?.[1]
      return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
    }
    return null
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

  const handleFollow = async () => {
    const currentUser = localStorage.getItem('currentNickname')
    if (!currentUser) { alert('Войди в кабинет'); return }
    if (isFollowing) {
      await fetch('/api/follow', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ follower_nickname: currentUser, following_nickname: nickname }) })
      setIsFollowing(false); setFollowersCount(f => f - 1)
    } else {
      await fetch('/api/follow', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ follower_nickname: currentUser, following_nickname: nickname }) })
      setIsFollowing(true); setFollowersCount(f => f + 1)
    }
  }

  if (loading) return <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">Загрузка...</main>
  if (!player) return <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">Игрок не найден</main>

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      <div className="max-w-4xl mx-auto p-6">
        <Link href="/" className="text-blue-400 hover:underline text-sm">← На главную</Link>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mt-6">
          <img src={player.avatar} className="w-24 h-24 rounded-full border-2 border-blue-500" alt="" />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold">{player.nickname}</h1>
            <p className="text-gray-400">Уровень {player.level} · ELO <span className="text-blue-400 font-semibold">{player.elo}</span></p>
            <p className="text-sm text-gray-500 mt-1">Винрейт: {player.stats?.lifetime?.['Win Rate %'] || '—'}% · K/D: {player.stats?.lifetime?.['Average K/D Ratio'] || '—'} · Матчей: {player.stats?.lifetime?.['Matches'] || '—'}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleFollow} className={`px-6 py-2 rounded-xl font-semibold text-sm ${isFollowing ? 'bg-gray-700' : 'bg-blue-500 hover:bg-blue-600'}`}>{isFollowing ? 'Отписаться' : 'Подписаться'}</button>
            <Link href={`/messages?to=${nickname}`} className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold text-sm">Сообщение</Link>
          </div>
        </div>
        <div className="flex gap-8 mt-8 justify-center md:justify-start border-b border-gray-800 pb-6">
          <div className="text-center"><p className="text-2xl font-bold">{followersCount}</p><p className="text-gray-500 text-sm">подписчиков</p></div>
          <div className="text-center"><p className="text-2xl font-bold">{followingCount}</p><p className="text-gray-500 text-sm">подписок</p></div>
          <div className="text-center"><p className="text-2xl font-bold">{highlights.length}</p><p className="text-gray-500 text-sm">хайлайтов</p></div>
        </div>
        <div className="mt-6"><span className="text-blue-400 font-semibold">🎬 Хайлайты</span></div>
        {highlights.length === 0 ? (
          <p className="text-gray-500 mt-8 text-center">Пока нет хайлайтов.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {highlights.map(h => {
              const thumb = getThumbnail(h.video_url)
              return (
                <div key={h.id} className="bg-gray-800/50 rounded-xl overflow-hidden">
                  <div className="aspect-video bg-gray-900 flex items-center justify-center cursor-pointer" onClick={() => setSelectedVideo(h.video_url)}>
                    {thumb ? <img src={thumb} className="w-full h-full object-cover" /> : <span className="text-4xl">▶️</span>}
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-sm truncate">{h.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{h.map_name} · ELO {h.elo_snapshot}</p>
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-gray-500">{new Date(h.created_at).toLocaleDateString()}</span>
                      <button onClick={() => handleLike(h.id)} className="text-red-400 text-xs">❤️ {likesMap[h.id] || 0}</button>
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
              <button onClick={() => setSelectedVideo(null)} className="absolute -top-10 right-0 text-white text-2xl">✕</button>
              <iframe src={selectedVideo.replace('watch?v=', 'embed/')} className="w-full h-full rounded-xl" allowFullScreen />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default function Profile() {
  return <Suspense fallback={<div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">Загрузка...</div>}><ProfileContent /></Suspense>
}