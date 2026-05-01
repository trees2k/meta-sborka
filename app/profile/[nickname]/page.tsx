'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function PublicProfile() {
  const [nickname, setNickname] = useState('')
  const [player, setPlayer] = useState<any>(null)
  const [highlights, setHighlights] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const path = window.location.pathname
    const nick = path.split('/').pop() || ''
    setNickname(nick)
  }, [])

  useEffect(() => {
    if (!nickname) return
    setLoading(true)
    fetch(`/api/faceit?nickname=${encodeURIComponent(nickname)}`)
      .then(r => r.json())
      .then(data => { if (!data.error) setPlayer(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [nickname])

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
        </div>
        <p className="text-center text-gray-500 mt-12">Хайлайты скоро появятся.</p>
      </div>
    </main>
  )
}