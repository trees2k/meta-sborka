'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Cabinet() {
  const [nickname, setNickname] = useState('')
  const [inputNick, setInputNick] = useState('')
  const [player, setPlayer] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('currentNickname') : null
    if (saved) {
      setNickname(saved)
      setInputNick(saved)
    }
  }, [])

  useEffect(() => {
    if (!nickname) return
    if (typeof window !== 'undefined') localStorage.setItem('currentNickname', nickname)
    setLoading(true)
    fetch(`/api/faceit?nickname=${encodeURIComponent(nickname)}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError(data.error); setPlayer(null) }
        else { setPlayer(data); setError('') }
      })
      .catch(() => setError('Ошибка загрузки'))
      .finally(() => setLoading(false))
  }, [nickname])

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <Link href="/" className="text-blue-400 hover:underline">← На главную</Link>
      <div className="max-w-2xl mx-auto mt-8">
        <div className="flex gap-2 mb-6">
          <input
            value={inputNick}
            onChange={e => setInputNick(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && setNickname(inputNick)}
            placeholder="Никнейм Faceit"
            className="flex-1 px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white"
          />
          <button onClick={() => setNickname(inputNick)} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold">
            Загрузить
          </button>
        </div>

        {loading && <p>Загрузка...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {player && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-2xl p-6 flex items-center gap-4">
              <img src={player.avatar} className="w-16 h-16 rounded-full" alt="" />
              <div>
                <p className="text-xl font-bold">{player.nickname}</p>
                <p className="text-gray-400">Уровень {player.level} · ELO {player.elo}</p>
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Статистика</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-gray-500 text-sm">Win Rate</p>
                  <p className="text-xl font-bold">{player.stats?.lifetime?.['Win Rate %'] || '—'}%</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">K/D</p>
                  <p className="text-xl font-bold">{player.stats?.lifetime?.['Average K/D Ratio'] || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Матчей</p>
                  <p className="text-xl font-bold">{player.stats?.lifetime?.['Matches'] || '—'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}