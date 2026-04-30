'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function DashboardContent() {
  const searchParams = useSearchParams()
  const [nickname, setNickname] = useState('')
  const [player, setPlayer] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const nick = searchParams.get('nickname')
    if (nick) { setNickname(nick); fetchPlayer(nick) }
  }, [searchParams])

  const fetchPlayer = (nick: string) => {
    if (!nick.trim()) return
    setLoading(true); setError(''); setPlayer(null)
    fetch(`/api/faceit?nickname=${encodeURIComponent(nick)}`)
      .then(r => r.json())
      .then(data => { if (data.error) setError('Игрок не найден'); else setPlayer(data) })
      .catch(() => setError('Ошибка загрузки'))
      .finally(() => setLoading(false))
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <Link href="/" className="text-blue-400 hover:underline">← На главную</Link>
      <div className="max-w-2xl mx-auto mt-8">
        <div className="flex gap-2 mb-6">
          <input value={nickname} onChange={e => setNickname(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchPlayer(nickname)}
            placeholder="Никнейм Faceit"
            className="flex-1 px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white" />
          <button onClick={() => fetchPlayer(nickname)} disabled={loading}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold disabled:opacity-50">
            {loading ? 'Загрузка...' : 'Загрузить'}
          </button>
        </div>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        {player && (
          <div className="bg-gray-800/50 rounded-2xl p-6 flex items-center gap-4">
            <img src={player.avatar} className="w-16 h-16 rounded-full" alt="" />
            <div>
              <p className="text-xl font-bold">{player.nickname}</p>
              <p className="text-gray-400">Уровень {player.level} · ELO {player.elo}</p>
              <p className="text-gray-500 text-sm">
                Винрейт: {player.stats?.lifetime?.['Win Rate %'] || '—'}% · K/D: {player.stats?.lifetime?.['Average K/D Ratio'] || '—'}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950 text-white p-6">Загрузка...</div>}>
      <DashboardContent />
    </Suspense>
  )
}