'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Target, Calendar, Upload } from 'lucide-react'

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
  const [demos, setDemos] = useState<any[]>([])
  const [demosLoading, setDemosLoading] = useState(false)
  const [analyses, setAnalyses] = useState<any[]>([])
  const [parseResult, setParseResult] = useState<any>(null)
  const [parsing, setParsing] = useState(false)
  const [parseProgress, setParseProgress] = useState('')

  useEffect(() => {
    const paramNick = searchParams.get('nickname')
    if (paramNick) {
      setNickname(paramNick)
      localStorage.setItem('currentNickname', paramNick)
    } else {
      const saved = localStorage.getItem('currentNickname')
      if (saved) setNickname(saved)
    }
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
          setPlayer(data)
          setError('')
          fetch('/api/elo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nickname: data.nickname, elo: data.elo })
          }).catch(() => {})
        }
      })
      .catch(() => setError('Ошибка загрузки'))
      .finally(() => setLoading(false))

    fetch(`/api/elo?nickname=${encodeURIComponent(nickname)}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setEloHistory(data.map((d: any) => ({ date: d.recorded_at, elo: d.elo })))
        }
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

  const handleFetchDemos = async () => {
    if (!nickname) return
    setDemosLoading(true)
    try {
      const res = await fetch(`/api/faceit?nickname=${encodeURIComponent(nickname)}`, { method: 'PATCH' })
      const data = await res.json()
      if (data.matches) setDemos(data.matches)
      else alert('Ошибка: ' + (data.error || 'Неизвестная ошибка'))
    } catch {
      alert('Ошибка при загрузке демок')
    }
    setDemosLoading(false)
  }

  const handleFetchAnalyses = async () => {
    if (!nickname) return
    const res = await fetch(`/api/demo/history?nickname=${encodeURIComponent(nickname)}`)
    const data = await res.json()
    if (data.analyses) setAnalyses(data.analyses)
  }

  // Загрузка напрямую на VPS (минуя Cloudflare лимит 100МБ)
  const handleFileParse = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !nickname) return

    setParsing(true)
    setParseResult(null)
    setParseProgress('Загрузка файла на сервер...')

    const vpsUrl = process.env.NEXT_PUBLIC_VPS_URL
    if (!vpsUrl) {
      alert('VPS URL не настроен')
      setParsing(false)
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      setParseProgress(`Загрузка ${(file.size / 1024 / 1024).toFixed(0)} МБ...`)

      const res = await fetch(`${vpsUrl}/analyze`, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()

      if (data.status !== 'ok') {
        alert('Ошибка анализа: ' + (data.detail || data.stderr || 'Неизвестная'))
        setParsing(false)
        setParseProgress('')
        return
      }

      setParseProgress('Обработка результатов...')

      // Ищем игрока по нику
      const players = data.data?.players || {}
      let found: any = null

      for (const [steamId, p] of Object.entries(players) as any) {
        if (p.name === nickname) {
          found = p
          break
        }
      }

      // Если по нику не нашли — берём первого
      if (!found) {
        const allPlayers = Object.values(players) as any[]
        if (allPlayers.length > 0) {
          found = allPlayers[0]
        }
      }

      if (!found) {
        alert('Игрок не найден в демке. Проверьте никнейм.')
        setParsing(false)
        setParseProgress('')
        return
      }

      const rounds = data.data?.rounds?.length || 1
      const stats = {
        name: found.name,
        kills: found.killCount || 0,
        deaths: found.deathCount || 0,
        assists: found.assistCount || 0,
        kd: found.killDeathRatio || 0,
        kast: found.kast || 0,
        headshotPercent: found.headshotPercent || 0,
        headshotCount: found.headshotCount || 0,
        adr: Math.round((found.healthDamage || 0) / rounds),
        utilityDamage: found.utilityDamage || 0,
        mvps: found.mvpCount || 0,
        score: found.score || 0,
        clutch1v1Won: found.oneVsOneWonCount || 0,
        clutch1v2Won: found.oneVsTwoWonCount || 0,
        clutch1v3Won: found.oneVsThreeWonCount || 0,
        clutch1v4Won: found.oneVsFourWonCount || 0,
        clutch1v5Won: found.oneVsFiveWonCount || 0,
        map: data.data?.mapName || 'unknown',
      }

      setParseResult(stats)
      setParseProgress('')

      // Сохраняем в историю
      try {
        await fetch('/api/demo/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nickname, ...stats })
        })
      } catch {}

    } catch (err: any) {
      alert('Ошибка: ' + err.message)
      setParseProgress('')
    } finally {
      setParsing(false)
    }
  }

  const progressPercent = goal && player
    ? Math.max(0, Math.min(100, ((player.elo - goal.startElo) / (goal.targetElo - goal.startElo)) * 100))
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
                    <span>Старт: {goal.startElo} ELO</span>
                    <span>Цель: {goal.targetElo} ELO</span>
                    <span className="flex items-center gap-1"><Calendar size={14} /> {daysLeft} дн.</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-4">
                    <div className="bg-blue-500 h-4 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
                  </div>
                  <p className="text-sm text-gray-400">
                    {progressPercent >= 100
                      ? 'Цель достигнута! Добро пожаловать в Клуб Апнутых!'
                      : `Прогресс: ${progressPercent.toFixed(0)}% · Осталось набрать ${goal.targetElo - player.elo} ELO`}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-gray-800/50 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><TrendingUp size={20} /> История ELO</h2>
              {eloHistory.length > 1 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={eloHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip />
                    <Line type="monotone" dataKey="elo" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-400">Недостаточно данных. Заходи ежедневно.</p>
              )}
            </div>

            <div className="bg-gray-800/50 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Upload size={20} /> Анализ демок</h2>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-400 mb-2">Загрузить демку для анализа</h3>
                <input
                  type="file"
                  accept=".dem"
                  onChange={handleFileParse}
                  disabled={parsing}
                  className="mb-2 text-sm"
                />
                {parsing && (
                  <div className="text-yellow-400 text-sm mb-2">
                    <p>⏳ {parseProgress}</p>
                    <p className="text-gray-500 text-xs mt-1">Большие файлы могут загружаться 3-5 минут</p>
                  </div>
                )}

                {parseResult && (
                  <div className="bg-gray-900/50 rounded-xl p-4 mb-4">
                    <p className="text-sm text-green-400 font-semibold mb-1">
                      ✅ Результаты анализа — {parseResult.name}
                    </p>
                    <p className="text-xs text-gray-500 mb-3">Карта: {parseResult.map}</p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      <div>💀 Убийства: <span className="text-white font-bold">{parseResult.kills}</span></div>
                      <div>☠️ Смерти: <span className="text-white font-bold">{parseResult.deaths}</span></div>
                      <div>🤝 Ассисты: <span className="text-white font-bold">{parseResult.assists}</span></div>
                      <div>⚔️ K/D: <span className="text-blue-400 font-bold">{parseResult.kd?.toFixed(2)}</span></div>
                      <div>🔥 ADR: <span className="text-orange-400 font-bold">{parseResult.adr}</span></div>
                      <div>🎯 HS%: <span className="text-green-400 font-bold">{parseResult.headshotPercent?.toFixed(1)}%</span></div>
                      <div>📊 KAST: <span className="text-cyan-400 font-bold">{parseResult.kast?.toFixed(1)}%</span></div>
                      <div>🔫 HS: <span className="text-yellow-400 font-bold">{parseResult.headshotCount}</span></div>
                      <div>💥 Урон утилит: <span className="text-purple-400 font-bold">{parseResult.utilityDamage}</span></div>
                      <div>⭐ MVP: <span className="text-yellow-400 font-bold">{parseResult.mvps}</span></div>
                      <div>🏆 1v1: <span className="text-emerald-400 font-bold">{parseResult.clutch1v1Won}</span></div>
                      <div>🏆 1v2+: <span className="text-emerald-400 font-bold">
                        {(parseResult.clutch1v2Won || 0) + (parseResult.clutch1v3Won || 0) + (parseResult.clutch1v4Won || 0) + (parseResult.clutch1v5Won || 0)}
                      </span></div>
                    </div>
                  </div>
                )}

                <p className="text-gray-500 text-xs">Поддерживаются .dem файлы CS2. Файл загружается напрямую на наш сервер.</p>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-400 mb-2">Найти демки с FACEIT</h3>
                <button
                  onClick={handleFetchDemos}
                  disabled={demosLoading}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-700 rounded-xl font-semibold text-sm"
                >
                  {demosLoading ? 'Загрузка...' : 'Найти мои демки'}
                </button>
                {demos.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {demos.map((demo: any, i: number) => (
                      <div key={i} className="bg-gray-900/50 rounded-xl p-3 flex items-center justify-between">
                        <p className="text-sm">Матч #{demo.match_id?.slice(0, 8)}</p>
                        {demo.demo_url ? (
                          <a href={demo.demo_url} target="_blank" className="text-blue-400 hover:underline text-sm">Скачать</a>
                        ) : (
                          <span className="text-gray-500 text-sm">Нет демки</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-2">История анализов</h3>
                <button
                  onClick={handleFetchAnalyses}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold text-sm mb-4"
                >
                  Загрузить историю
                </button>
                {analyses.length > 0 && (
                  <div className="space-y-3">
                    {analyses.map((a: any, i: number) => (
                      <div key={i} className="bg-gray-900/50 rounded-xl p-4">
                        <p className="text-sm text-gray-400">
                          {a.map} · {new Date(a.created_at).toLocaleDateString('ru-RU')}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm">
                          <div>K/D: <span className="text-blue-400">{a.kd?.toFixed(2)}</span></div>
                          <div>ADR: <span className="text-orange-400">{a.adr}</span></div>
                          <div>HS%: <span className="text-green-400">{a.headshot_percent?.toFixed(1)}%</span></div>
                          <div>KAST: <span className="text-cyan-400">{a.kast?.toFixed(1)}%</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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