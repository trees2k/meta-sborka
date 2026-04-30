'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

function DashboardContent() {
  const searchParams = useSearchParams()
  const [nickname, setNickname] = useState('')
  const [player, setPlayer] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const nick = searchParams.get('nickname')
    if (nick) setNickname(nick)
  }, [searchParams])

  const handleFetch = () => {
    if (!nickname) return
    setLoading(true)
    setError('')
    fetch(`/api/faceit?nickname=${encodeURIComponent(nickname)}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError(data.error); setPlayer(null) }
        else { setPlayer(data); setError('') }
      })
      .catch(() => setError('Ошибка'))
      .finally(() => setLoading(false))
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <Link href="/" className="text-blue-500">← На главную</Link>
      <div className="max-w-2xl mx-auto mt-8">
        <div className="flex gap-2 mb-6">
          <input value={nickname} onChange={e => setNickname(e.target.value)} placeholder="Никнейм Faceit"
            className="flex-1 px-4 py-2 rounded-xl bg-gray-800 border border-gray-700" />
          <button onClick={handleFetch} className="px-4 py-2 bg-blue-500 rounded-xl font-semibold">Загрузить</button>
        </div>
        {loading && <p>Загрузка...</p>}
        {error && <p className="text-red-500">{error}</p>}
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

export default function Dashboard() {
  return <Suspense fallback={<div className="min-h-screen bg-gray-950 text-white p-6">Загрузка...</div>}><DashboardContent /></Suspense>
}