'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Target, Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface PlayerData {
  nickname: string
  player_id: string
  avatar: string
  level: number
  elo: number
  stats: any
}

interface Goal {
  startDate: string
  startElo: number
  targetElo: number
  nickname: string
}

interface Snapshot {
  date: string
  elo: number
}

function CabinetContent() {
  const searchParams = useSearchParams()
  const [nickname, setNickname] = useState('')
  const [player, setPlayer] = useState<PlayerData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [goal, setGoal] = useState<Goal | null>(null)
  const [targetInput, setTargetInput] = useState('')
  const [snapshots, setSnapshots] = useState<Snapshot[]>([])

  useEffect(() => {
    const paramNick = searchParams.get('nickname')
    if (paramNick) {
      setNickname(paramNick)
      if (typeof window !== 'undefined') localStorage.setItem('currentNickname', paramNick)
    } else {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('currentNickname')
        if (saved) setNickname(saved)
      }
    }
  }, [searchParams])

  useEffect(() => {
    if (!nickname) return
    const savedGoal = typeof window !== 'undefined' ? localStorage.getItem(`goal_${nickname}`) : null
    if (savedGoal) setGoal(JSON.parse(savedGoal))
    const savedSnapshots = typeof window !== 'undefined' ? localStorage.getItem(`snapshots_${nickname}`) : null
    if (savedSnapshots) setSnapshots(JSON.parse(savedSnapshots))
  }, [nickname])

  useEffect(() => {
    if (!nickname) return
    setLoading(true)
    fetch(`/api/faceit?nickname=${encodeURIComponent(nickname)}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) { setError(data.error); setPlayer(null) }
        else {
          setPlayer(data)
          setError('')
          const today = new Date().toISOString().split('T')[0]
          const newSnapshots = [...snapshots]
          if (!newSnapshots.length || newSnapshots[newSnapshots.length - 1].date !== today) {
            newSnapshots.push({ date: today, elo: data.elo })
            setSnapshots(newSnapshots)
            if (typeof window !== 'undefined') localStorage.setItem(`snapshots_${nickname}`, JSON.stringify(newSnapshots))
          }
        }
      })
      .catch(() => setError('Ошибка загрузки данных'))
      .finally(() => setLoading(false))
  }, [nickname])

  const handleSetGoal = () => {
    if (!player || !targetInput) return
    const targetIncrease = parseInt(targetInput)
    if (isNaN(targetIncrease) || targetIncrease <= 0) return
    const newGoal: Goal = {
      startDate: new Date().toISOString().split('T')[0],
      startElo: player.elo,
      targetElo: player.elo + targetIncrease,
      nickname: player.nickname
    }
    setGoal(newGoal)
    if (typeof window !== 'undefined') localStorage.setItem(`goal_${player.nickname}`, JSON.stringify(newGoal))
    setTargetInput('')
  }

  const progressPercent = goal && player
    ? Math.min(100, ((player.elo - goal.startElo) / (goal.targetElo - goal.startElo)) * 100)
    : 0

  const daysLeft = goal
    ? Math.max(0, 30 - Math.floor((new Date().getTime() - new Date(goal.startDate).getTime()) / (1000 * 60 * 60 * 24)))
    : 0

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href="/" className="text-blue-500 hover:underline">← На главную</Link>

        {!nickname && (
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold mb-4">Введи никнейм Faceit</h1>
            <form onSubmit={e => { e.preventDefault(); const i = (e.target as any).nick; window.location.href = `/cabinet?nickname=${encodeURIComponent(i.value)}` }}>
              <input name="nick" type="text" placeholder="meesoze" className="px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white" />
              <button type="submit" className="ml-2 px-4 py-2 bg-blue-500 rounded-xl font-semibold">Войти</button>
            </form>
          </div>
        )}

        {loading && <p className="text-center py-20">Загрузка...</p>}
        {error && <p className="text-center py-20 text-red-500">{error}</p>}

        {player && (
          <>
            <div className="flex items-center gap-4 bg-gray-800/50 rounded-2xl p-6">
              <img src={player.avatar} className="w-16 h-16 rounded-full" />
              <div>
                <h1 className="text-2xl font-bold">{player.nickname}</h1>
                <p className="text-gray-400">Уровень {player.level} · ELO {player.elo}</p>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Target size={20} /> Цель месяца</h2>
              {!goal ? (
                <div className="flex gap-2">
                  <input type="number" placeholder="На сколько ELO апнуть?" value={targetInput} onChange={e => setTargetInput(e.target.value)} className="px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white flex-1" />
                  <button onClick={handleSetGoal} className="px-4 py-2 bg-blue-500 rounded-xl font-semibold">Установить</button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Старт: {goal.startElo} ELO</span>
                    <span>Цель: {goal.targetElo} ELO</span>
                    <span className="flex items-center gap-1"><Calendar size={14} /> {daysLeft} дн.</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-4">
                    <div className="bg-blue-500 h-4 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
                  </div>
                  <p className="text-sm text-gray-400">
                    {progressPercent >= 100
                      ? 'Цель достигнута! Поздравляем, вы в Клубе Апнутых!'
                      : `Прогресс: ${progressPercent.toFixed(0)}% · Осталось набрать ${goal.targetElo - player.elo} ELO`}
                  </p>
                  {progressPercent < 100 && daysLeft === 0 && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                      <p className="text-red-400">Месяц истёк. Цель не достигнута. Деньги будут возвращены (демо).</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-gray-800/50 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><TrendingUp size={20} /> Динамика ELO</h2>
              {snapshots.length > 1 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={snapshots}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip />
                    <Line type="monotone" dataKey="elo" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-400">Недостаточно данных. Заходите ежедневно, чтобы накапливать историю.</p>
              )}
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