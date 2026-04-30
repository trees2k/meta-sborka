'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Target, Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'

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
    const paramNick = searchParams.get('nickname')
    if (paramNick) { setNickname(paramNick); localStorage.setItem('currentNickname', paramNick) }
    else { const saved = localStorage.getItem('currentNickname'); if (saved) setNickname(saved) }
  }, [searchParams])

  useEffect(() => {
    if (!nickname) return
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
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nickname: data.nickname, elo: data.elo })
          }).catch(() => {})
        }
      })
      .catch(() => setError('Ошибка'))
      .finally(() => setLoading(false))

    fetch(`/api/elo?nickname=${encodeURIComponent(nickname)}`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setEloHistory(data.map((d: any) => ({ date: d.recorded_at, elo: d.elo }))) })
      .catch(() => {})
  }, [nickname])

  const handleSetGoal = () => {
    if (!player || !targetInput) return
    const increase = parseInt(targetInput)
    if (isNaN(increase) || increase <= 0) return
    const newGoal = { startDate: new Date().toISOString().split('T')[0], startElo: player.elo, targetElo: player.elo + increase, nickname: player.nickname }
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
            <h1 className="text-3xl font-bold mb-4">Введи никнейм Faceit</h1>
            <form onSubmit={e => { e.preventDefault(); window.location.href = `/cabinet?nickname=${encodeURIComponent((e.target as any).nick.value)}` }}>
              <input name="nick" type="text" placeholder="meesoez" className="px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white" />
              <button type="submit" className="ml-2 px-4 py-2 bg-blue-500 rounded-xl font-semibold">Войти</button>
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
                  <div className="w-full bg-gray-700 rounded-full h-4"><div className="bg-blue-500 h-4 rounded-full transition-all" style={{ width: `${progressPercent}%` }} /></div>
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
              ) : <p className="text-gray-400">Недостаточно данных. Заходи ежедневно.</p>}
            </div>
          </>
        )}
      </div>
    </main>
  )
}

export default function Cabinet() {
  return <Suspense fallback={<div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">Загрузка...</div>}><CabinetContent /></Suspense>
}