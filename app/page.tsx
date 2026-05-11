'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Zap, TrendingUp, Clock, Target, Shield, Frown, Users, Play, User } from 'lucide-react'

export default function Landing() {
  const [nickname, setNickname] = useState('')
  const [player, setPlayer] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)

  // Проверяем, авторизован ли пользователь, и получаем его профиль
  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data.user) {
          setLoggedIn(true)
          setUser(data.user)
          if (data.user.faceit_nickname) {
            localStorage.setItem('currentNickname', data.user.faceit_nickname)
          }
        }
      })
      .catch(() => setLoggedIn(false))
  }, [])

  const handleScan = async () => {
    if (!nickname.trim()) return
    setLoading(true); setError(''); setPlayer(null)
    try {
      const res = await fetch(`/api/faceit?nickname=${encodeURIComponent(nickname)}`)
      const data = await res.json()
      if (data.error) setError('Игрок не найден')
      else setPlayer(data)
    } catch { setError('Ошибка соединения') }
    setLoading(false)
  }

  const idealTime = player?.elo > 2000 ? '19:00 – 21:00' : '20:00 – 22:00'
  const winRate = player?.stats?.lifetime?.['Win Rate %'] || '—'
  const potentialElo = player?.elo ? Math.round(player.elo * 1.07) : '—'

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      {/* Шапка с кнопками входа/регистрации или профилем */}
      <header className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">Ufuture</Link>
        <div className="flex items-center gap-4">
          {loggedIn ? (
            <Link href={user?.faceit_nickname ? `/profile/${user.faceit_nickname}` : '/profile/setup'} className="flex items-center gap-1 text-sm text-gray-300 hover:text-white">
              <User size={18} /> Профиль
            </Link>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm text-gray-300 hover:text-white">Войти</Link>
              <Link href="/auth/signup" className="px-4 py-1 bg-blue-500 hover:bg-blue-600 rounded-full text-sm">Регистрация</Link>
            </>
          )}
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 pt-24 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-1.5 text-sm text-blue-400 mb-6">
          <Zap size={14} /> Бесплатный AI-чекап
        </div>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
          Узнай, сколько ELO ты теряешь
        </h1>
        <p className="text-lg text-gray-400 mb-8">
          Введи никнейм Faceit и получи персональный отчёт.
        </p>
        <div className="flex gap-2 max-w-md mx-auto mb-4">
          <input
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleScan()}
            placeholder="Твой никнейм Faceit"
            className="flex-1 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500"
          />
          <button onClick={handleScan} disabled={loading}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-700 rounded-xl font-semibold">
            {loading ? 'Анализ...' : 'Сканировать'}
          </button>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </section>

      {player && (
        <section className="max-w-2xl mx-auto px-6 pb-16">
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-4">
              <img src={player.avatar} className="w-14 h-14 rounded-full" alt="" />
              <div>
                <p className="text-xl font-bold">{player.nickname}</p>
                <p className="text-gray-400">Уровень {player.level} · ELO {player.elo}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-900/50 rounded-xl p-4 text-center">
                <Clock className="text-blue-400 mx-auto mb-1" size={18} />
                <p className="text-xs text-gray-500">Идеальный слот</p>
                <p className="font-semibold text-sm">{idealTime}</p>
              </div>
              <div className="bg-gray-900/50 rounded-xl p-4 text-center">
                <Target className="text-green-400 mx-auto mb-1" size={18} />
                <p className="text-xs text-gray-500">Потенциал ELO</p>
                <p className="font-semibold text-sm text-green-400">+{potentialElo}</p>
              </div>
              <div className="bg-gray-900/50 rounded-xl p-4 text-center">
                <TrendingUp className="text-yellow-400 mx-auto mb-1" size={18} />
                <p className="text-xs text-gray-500">Винрейт</p>
                <p className="font-semibold text-sm">{winRate}%</p>
              </div>
              <div className="bg-gray-900/50 rounded-xl p-4 text-center">
                <Frown className="text-red-400 mx-auto mb-1" size={18} />
                <p className="text-xs text-gray-500">Слабых мест</p>
                <p className="font-semibold text-sm">3</p>
              </div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-300 mb-2">Хочешь полный AI-разбор и план апа?</p>
              <Link href={`/cabinet?nickname=${player.nickname}`}
                className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-xl font-semibold text-sm">
                В личный кабинет <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="bg-gray-800/50 rounded-2xl p-8 text-center">
          <Zap className="text-blue-400 mx-auto mb-4" size={24} />
          <h3 className="font-semibold text-lg mb-2">AI-чекап</h3>
          <p className="text-gray-400 text-sm">Бесплатный анализ Faceit за 5 секунд.</p>
        </div>
        <div className="bg-gray-800/50 rounded-2xl p-8 text-center">
          <Target className="text-blue-400 mx-auto mb-4" size={24} />
          <h3 className="font-semibold text-lg mb-2">План на месяц</h3>
          <p className="text-gray-400 text-sm">Рекомендации: сон, время игры, анти-тильт.</p>
        </div>
        <div className="bg-gray-800/50 rounded-2xl p-8 text-center">
          <Shield className="text-blue-400 mx-auto mb-4" size={24} />
          <h3 className="font-semibold text-lg mb-2">Гарантия возврата</h3>
          <p className="text-gray-400 text-sm">Не апнул ранг — деньги возвращаются.</p>
        </div>
        <div className="bg-gray-800/50 rounded-2xl p-8 text-center">
          <Users className="text-blue-400 mx-auto mb-4" size={24} />
          <h3 className="font-semibold text-lg mb-2">Подбор команды</h3>
          <p className="text-gray-400 text-sm">Заполни анкету — соберём идеальный состав.</p>
          <Link href="/anketa" className="inline-block mt-4 text-blue-400 hover:underline text-sm">Заполнить →</Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link href="/highlights" className="bg-gray-800/50 rounded-2xl p-8 text-center hover:bg-gray-800 transition-all">
          <Play className="text-blue-400 mx-auto mb-4" size={24} />
          <h3 className="font-semibold text-lg mb-2">Лента хайлайтов</h3>
          <p className="text-gray-400 text-sm">Смотри и делись лучшими моментами.</p>
        </Link>
      </section>

      <section className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6">Одна подписка — всё включено</h2>
        <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
          <p className="text-5xl font-bold mb-4">$29<span className="text-lg font-normal text-gray-400">/мес</span></p>
          <p className="text-gray-400 mb-6">AI-коуч, разбор демок, подбор команды, хайлайты и гарантия апа.</p>
          <Link href="/cabinet" className="block w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold">
            Попробовать
          </Link>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-6 py-8 text-center">
        <Link href="/blog" className="text-blue-400 hover:underline text-lg">
          📰 Читать блог Ufuture →
        </Link>
      </section>

      <footer className="text-center py-8 text-gray-600 text-sm">
        Ufuture © 2025. AI-платформа для геймеров.
      </footer>
    </main>
  )
}