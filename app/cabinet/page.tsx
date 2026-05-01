'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function CabinetContent() {
  const searchParams = useSearchParams()
  const [nickname, setNickname] = useState('')
  const [player, setPlayer] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const nick = searchParams.get('nickname') || localStorage.getItem('currentNickname') || ''
    if (nick) setNickname(nick)
  }, [searchParams])

  useEffect(() => {
    if (!nickname) return
    localStorage.setItem('currentNickname', nickname)
    setLoading(true)
    fetch(`/api/faceit?nickname=${encodeURIComponent(nickname)}`)
      .then(r => r.json())
      .then(data => { if (!data.error) setPlayer(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [nickname])

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <Link href="/" className="text-blue-400">← На главную</Link>
      <div className="max-w-2xl mx-auto mt-8">
        {!nickname && (
          <form onSubmit={e => { e.preventDefault(); setNickname((e.target as any).nick.value) }}>
            <input name="nick" placeholder="Никнейм Faceit" className="px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white" />
            <button type="submit" className="ml-2 px-4 py-2 bg-blue-500 rounded-xl">Войти</button>
          </form>
        )}
        {loading && <p>Загрузка...</p>}
        {player && (
          <div className="bg-gray-800/50 rounded-2xl p-6 flex items-center gap-4">
            <img src={player.avatar} className="w-16 h-16 rounded-full" />
            <div>
              <p className="text-xl font-bold">{player.nickname}</p>
              <p className="text-gray-400">Уровень {player.level} · ELO {player.elo}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default function Cabinet() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950 text-white p-6">Загрузка...</div>}>
      <CabinetContent />
    </Suspense>
  )
}