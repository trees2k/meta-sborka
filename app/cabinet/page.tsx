'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Target, Calendar } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function HighlightsSection({ nickname, currentElo }: { nickname: string; currentElo: number }) {
  const [highlights, setHighlights] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [mapName, setMapName] = useState('')
  const [likesMap, setLikesMap] = useState<Record<number, number>>({})

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
    const res = await fetch('/api/likes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ highlight_id: highlightId, nickname })
    })
    const data = await res.json()
    if (data.ok) setLikesMap(prev => ({ ...prev, [highlightId]: data.likes }))
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Название (Клатч 1v3)" className="px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm flex-1 min-w-[200px]" />
        <input value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="Ссылка на видео" className="px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm flex-1 min-w-[200px]" />
        <input value={mapName} onChange={e => setMapName(e.target.value)} placeholder="Карта (Mirage)" className="px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm w-[150px]" />
        <button onClick={handleAdd} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold text-sm">Добавить</button>
      </div>
      {highlights.length === 0 ? (
        <p className="text-gray-500 text-sm">Пока нет хайлайтов.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {highlights.map(h => (
            <div key={h.id} className="bg-gray-900/50 rounded-xl p-4">
              <p className="font-semibold text-sm">{h.title}</p>
              <p className="text-xs text-gray-500">{h.map_name} · ELO {h.elo_snapshot}</p>
              <div className="flex items-center justify-between mt-2">
                <a href={h.video_url} target="_blank" className="text-blue-400 text-xs hover:underline">Смотреть →</a>
                <button onClick={() => handleLike(h.id)} className="text-red-400 text-xs hover:text-red-300">❤️ {likesMap[h.id] || 0}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function CabinetContent() {
  const searchParams = useSearchParams()
  const [nickname, setNickname] = useState('')
  const [player, setPlayer] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [goal, setGoal] = useState<any>(null)
  const [targetInput, setTargetInput] = useState('')
  const [eloHistory, setEloHistory] = useState<any[]>([])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        supabase.from('profiles').select('faceit_nickname').eq('id', data.user.id).single().then(({ data: profile }) => {
          if (profile?.faceit_nickname) setNickname(profile.faceit_nickname)
        })
      }
    })
    const paramNick = searchParams.get('nickname')
    if (paramNick) setNickname(paramNick)
    else {
      const saved = localStorage.getItem('currentNickname')
      if (saved) setNickname(saved)
    }
  }, [searchParams])

  useEffect(() => {
    if (!nickname) return
    localStorage.setItem('currentNickname', nickname)
    const savedGoal = localStorage.getItem(`goal_${nickname}`)
    if (savedGoal) setGoal(JSON.parse(savedGoal))
  }, [nickname])

  useEffect(() => {
    if (!nickname) return
    setLoading(true)
    fetch(`/api/faceit?nickname=${encodeURIComponent(nickname)}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError('Игрок не найден'); setPlayer(null) }
        else {
          setPlayer(data); setError('')
          fetch('/api/elo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nickname: data.nickname, elo: data.elo })
          }).catch(() => {})
        }
      })
      .catch(() => setError('Ошибка'))
      .finally(() => setLoading(false))

    fetch(`/api/elo?nickname=${encodeURIComponent(nickname)}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setEloHistory(data.map((d: any) => ({ date: d.recorded_at, elo: d.elo })))
      })
      .catch(() => {})
  }, [nickname])

  const handleSetGoal = () => {
    if (!player || !targetInput) return
    const increase = parseInt(targetInput)
    if (isNaN(increase) || increase <= 0) return
    const newGoal = {
      startDate: new Date().toISOString().split('T')[0],
      startElo: player.elo,
      targetElo: player.elo + increase,
      nickname: player.nickname
    }
    setGoal(newGoal)
    localStorage.setItem(`goal_${player.nickname}`, JSON.stringify(newGoal))
    setTargetInput('')
  }

  const progressPercent = goal && player ? Math.min(100, ((player.elo - goal.startElo) / (goal.targetElo - goal.startElo)) * 100) : 0
  const daysLeft = goal ? Math.max(0, 30 - Math.floor((new Date().getTime() - new Date(goal.startDate).getTime()) / 86400000)) : 0

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href="/" className="text-blue-500 hover:underline">← На главную</Link>

        {!nickname && (
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold mb-4">Привяжи Faceit</h1>
            <form onSubmit={e => { e.preventDefault(); setNickname((e.target as any).nick.value) }}>
              <input name="nick" type="text" placeholder="Твой никнейм Faceit" className="px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white" />
              <button type="submit" className="ml-2 px-4 py-2 bg-blue-500 rounded-xl font-semibold">Сохранить</button>
            </form>
          </div>
        )}

        {loading && <p className="text-center py-20">Загрузка...</p>}
        {error && <p className="text-center py-20 text-red-500">{error}</p>}

        {player && (
          <>
            <div className="flex items-center gap-4 bg-gray-800/50 rounded-2xl p-6">
              <img src={player.avatar} className="w-16 h-16 rounded-full" alt="" />
              <div>
                <h1 className="text-2xl font-bold">{player.nickname}</h1>
                <p className="text-gray-400">Уровень {player.level} · ELO {player.elo}</p>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Target size={20} /> Цель на месяц</h2>
              {!goal ? (
                <div className="flex gap-2">
                  <input type="number" placeholder="На сколько ELO апнуть?" value={targetInput} onChange={e => setTargetInput(e.target.value)} className="px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white flex-1" />
                  <button onClick={handleSetGoal} className="px-4 py-2 bg-blue-500 rounded-xl font-semibold">Установить</button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Старт: {goal.startElo} ELO</span><span>Цель: {goal.targetElo} ELO</span><span className="flex items-center gap-1"><Calendar size={14} /> {daysLeft} дн.</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-4"><div className="bg-blue-500 h-4 rounded-full" style={{ width: `${progressPercent}%` }} /></div>
                  <p className="text-sm text-gray-400">{progressPercent >= 100 ? 'Цель достигнута!' : `Прогресс: ${progressPercent.toFixed(0)}% · Осталось ${goal.targetElo - player.elo} ELO`}</p>
                </div>
              )}
            </div>

            <div className="bg-gray-800/50 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><TrendingUp size={20} /> История ELO</h2>
              {eloHistory.length > 1 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={eloHistory}><CartesianGrid strokeDasharray="3 3" stroke="#374151" /><XAxis dataKey="date" stroke="#9CA3AF" /><YAxis stroke="#9CA3AF" /><Tooltip /><Line type="monotone" dataKey="elo" stroke="#3b82f6" strokeWidth={2} /></LineChart>
                </ResponsiveContainer>
              ) : <p className="text-gray-400">Недостаточно данных.</p>}
            </div>

            <div className="bg-gray-800/50 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">🎬 Мои хайлайты</h2>
              <HighlightsSection nickname={player.nickname} currentElo={player.elo} />
            </div>
          </>
        )}
      </div>
    </main>
  )
}

export default function Cabinet() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">Загрузка...</div>}>
      <CabinetContent />
    </Suspense>
  )
}