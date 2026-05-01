'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function PublicProfile() {
  const params = useParams()
  const nickname = (params?.nickname as string) || ''
  const [player, setPlayer] = useState<any>(null)
  const [highlights, setHighlights] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followersCount, setFollowersCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)

  useEffect(() => {
    if (!nickname) return
    setLoading(true)

    fetch(`/api/faceit?nickname=${encodeURIComponent(nickname)}`)
      .then(r => r.json())
      .then(data => { if (!data.error) setPlayer(data) })
      .catch(() => {})

    fetch(`/api/highlights?nickname=${encodeURIComponent(nickname)}`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setHighlights(data) })
      .catch(() => {})

    fetch(`/api/follow?nickname=${encodeURIComponent(nickname)}&type=followers`)
      .then(r => r.json())
      .then(data => setFollowersCount(data.count || 0))
      .catch(() => {})

    fetch(`/api/follow?nickname=${encodeURIComponent(nickname)}&type=following`)
      .then(r => r.json())
      .then(data => setFollowingCount(data.count || 0))
      .catch(() => {})

    setLoading(false)
  }, [nickname])

  const handleFollow = async () => {
    const currentUser = typeof window !== 'undefined' ? localStorage.getItem('currentNickname') : null
    if (!currentUser) { alert('Войди в кабинет'); return }
    if (isFollowing) {
      await fetch('/api/follow', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ follower_nickname: currentUser, following_nickname: nickname }) })
      setIsFollowing(false)
      setFollowersCount(f => f - 1)
    } else {
      await fetch('/api/follow', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ follower_nickname: currentUser, following_nickname: nickname }) })
      setIsFollowing(true)
      setFollowersCount(f => f + 1)
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
            <p className="text-sm text-gray-500 mt-1">
              Винрейт: {player.stats?.lifetime?.['Win Rate %'] || '—'}% · K/D: {player.stats?.lifetime?.['Average K/D Ratio'] || '—'} · Матчей: {player.stats?.lifetime?.['Matches'] || '—'}
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleFollow} className={`px-6 py-2 rounded-xl font-semibold text-sm ${isFollowing ? 'bg-gray-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}>
              {isFollowing ? 'Отписаться' : 'Подписаться'}
            </button>
            <Link href={`/messages?to=${encodeURIComponent(nickname)}`} className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold text-sm">
              Сообщение
            </Link>
          </div>
        </div>

        <div className="flex gap-8 mt-8 justify-center md:justify-start border-b border-gray-800 pb-6">
          <div className="text-center"><p className="text-2xl font-bold">{followersCount}</p><p className="text-gray-500 text-sm">подписчиков</p></div>
          <div className="text-center"><p className="text-2xl font-bold">{followingCount}</p><p className="text-gray-500 text-sm">подписок</p></div>
          <div className="text-center"><p className="text-2xl font-bold">{highlights.length}</p><p className="text-gray-500 text-sm">хайлайтов</p></div>
        </div>

        <div className="flex gap-6 mt-6 border-b border-gray-800 pb-3">
          <span className="text-blue-400 font-semibold border-b-2 border-blue-400 pb-3">🎬 Хайлайты</span>
        </div>

        {highlights.length === 0 ? (
          <p className="text-gray-500 mt-8 text-center">Пока нет хайлайтов.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {highlights.map(h => (
              <div key={h.id} className="bg-gray-800/50 rounded-xl p-4 hover:bg-gray-800 transition-all">
                <p className="font-semibold text-sm truncate">{h.title}</p>
                <p className="text-xs text-gray-500 mt-1">{h.map_name} · ELO {h.elo_snapshot}</p>
                <a href={h.video_url} target="_blank" className="text-blue-400 text-xs hover:underline mt-2 inline-block">Смотреть →</a>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}