'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  BarChart3, Play, Users, Trophy, Upload, Star,
  TrendingUp, Zap, Shield, Target, ChevronRight,
  Menu, X, Clock, Swords, BarChart2, Download,
  CheckCircle, AlertCircle, Heart, Video
} from 'lucide-react'

// ─── Sidebar ─────────────────────────────────────────────────────────────────
function Sidebar({ nickname, sidebarOpen, setSidebarOpen, activeTab, setActiveTab }: {
  nickname: string
  sidebarOpen: boolean
  setSidebarOpen: (v: boolean) => void
  activeTab: string
  setActiveTab: (t: string) => void
}) {
  const tabs = [
    { id: 'overview', label: 'Обзор', icon: BarChart3, color: 'from-blue-500 to-cyan-500' },
    { id: 'demos', label: 'Демки', icon: Swords, color: 'from-red-500 to-orange-500' },
    { id: 'highlights', label: 'Мои хайлайты', icon: Play, color: 'from-pink-500 to-purple-500' },
    { id: 'elo', label: 'ELO трекер', icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
  ]

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-72 bg-gray-950/95 backdrop-blur-md
        border-r border-gray-800/50 flex flex-col z-40
        transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-gray-800/50">
          <Link href="/">
            <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              UFUTURE
            </h1>
          </Link>
          <p className="text-xs text-gray-500 mt-1">Кабинет игрока</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {tabs.map(item => {
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false) }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all
                  ${isActive
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }
                `}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}

          <div className="pt-2 border-t border-gray-800/50 mt-2">
            {[
              { href: '/', label: 'Главная', icon: BarChart3 },
              { href: '/highlights', label: 'Лента хайлайтов', icon: Play },
              { href: '/anketa', label: 'Найти команду', icon: Users },
            ].map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-gray-300 hover:bg-gray-800/30 transition-all text-sm"
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-800/50">
          {nickname && (
            <Link href={`/profile/${nickname}`} className="flex items-center gap-2 px-4 py-3 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                {nickname[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold">{nickname}</p>
                <p className="text-xs text-gray-500">Мой профиль</p>
              </div>
            </Link>
          )}
        </div>
      </aside>
    </>
  )
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab({ nickname, faceit }: { nickname: string; faceit: any }) {
  const stats = faceit?.stats?.lifetime

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black">Обзор</h2>
        <p className="text-gray-400 mt-1">Твоя статистика и прогресс</p>
      </div>

      {/* ELO баннер */}
      {faceit && (
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-2xl p-6 flex items-center gap-5">
          <img
            src={faceit.avatar}
            className="w-16 h-16 rounded-xl object-cover border-2 border-blue-500/30"
            onError={e => { e.currentTarget.style.display = 'none' }}
          />
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-xl font-black">{faceit.nickname}</h3>
              <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-sm font-bold rounded-full">
                ELO {faceit.elo}
              </span>
            </div>
            <p className="text-gray-400 text-sm mt-1">Faceit уровень {faceit.level || '—'}</p>
          </div>
          <Link href={`/profile/${nickname}`} className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl text-sm font-medium transition-colors">
            Профиль <ChevronRight size={14} />
          </Link>
        </div>
      )}

      {/* Статистика */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Винрейт', value: `${stats['Win Rate %'] || '—'}%`, icon: Trophy, color: 'from-emerald-500 to-green-600', bg: 'bg-emerald-500/10' },
            { label: 'K/D Ratio', value: stats['Average K/D Ratio'] || '—', icon: Swords, color: 'from-red-500 to-orange-500', bg: 'bg-red-500/10' },
            { label: 'HS%', value: `${stats['Average Headshots %'] || '—'}%`, icon: Target, color: 'from-yellow-500 to-amber-500', bg: 'bg-yellow-500/10' },
            { label: 'Матчей', value: stats['Matches'] || '—', icon: BarChart2, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10' },
          ].map((s, i) => (
            <div key={i} className={`${s.bg} border border-gray-700/50 rounded-2xl p-5`}>
              <div className={`w-10 h-10 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center mb-3`}>
                <s.icon size={18} className="text-white" />
              </div>
              <p className="text-2xl font-black">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Быстрые действия */}
      <div className="bg-gray-800/50 rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-4">Быстрые действия</h3>
        <div className="space-y-3">
          {[
            { label: 'Загрузить демку', desc: 'Разбор ошибок с AI-анализом', icon: Upload, color: 'bg-red-500/20 text-red-400', tab: 'demos' },
            { label: 'Мои хайлайты', desc: 'Управление видео-клипами', icon: Video, color: 'bg-pink-500/20 text-pink-400', tab: 'highlights' },
            { label: 'ELO трекер', desc: 'График роста рейтинга', icon: TrendingUp, color: 'bg-green-500/20 text-green-400', tab: 'elo' },
          ].map((item, i) => (
            <button
              key={i}
              className="w-full flex items-center justify-between bg-gray-900/50 hover:bg-gray-700/50 rounded-xl p-4 transition-all group text-left"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center`}>
                  <item.icon size={18} />
                </div>
                <div>
                  <p className="font-semibold text-sm">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-600 group-hover:text-white transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Demos Tab ─────────────────────────────────────────────────────────────────
function DemosTab() {
  const [tab, setTab] = useState<'upload' | 'history'>('upload')
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<any[]>([])
  const [nickname, setNickname] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('currentNickname')
    if (saved) {
      setNickname(saved)
      fetch(`/api/demo/history?nickname=${saved}`)
        .then(r => r.json())
        .then(data => setHistory(data.history || []))
        .catch(() => {})
    }
  }, [])

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    setError(null)
    setAnalysis(null)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/demo/analysis', { method: 'POST', body: form })
      const json = await res.json()
      if (json.status === 'ok') setAnalysis(json.analysis)
      else setError(json.detail || json.error || 'Ошибка анализа')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black">Разбор демок</h2>
        <p className="text-gray-400 mt-1">Загружай демки и получай AI-анализ ошибок</p>
      </div>

      <div className="flex gap-2">
        {[
          { id: 'upload', label: 'Загрузить' },
          { id: 'history', label: 'История' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === t.id
                ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                : 'bg-gray-800/50 text-gray-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'upload' && (
        <div className="space-y-4">
          {loading ? (
            <div className="bg-gray-800/50 rounded-2xl p-12 text-center">
              <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-6" />
              <h3 className="text-xl font-bold mb-2">Анализируем демку...</h3>
              <p className="text-gray-400 text-sm">Может занять 2-5 минут</p>
              <div className="mt-6 space-y-2 text-sm text-gray-500">
                <p>⚙️ Парсинг событий матча</p>
                <p>🗺️ Обработка позиций на карте</p>
                <p>🧠 Анализ ошибок</p>
              </div>
            </div>
          ) : analysis ? (
            <div className="space-y-4">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 flex items-center gap-3">
                <CheckCircle size={24} className="text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="font-bold">Анализ завершён!</p>
                  <p className="text-sm text-gray-400">{analysis.stats?.nickname} · {analysis.stats?.map} · {analysis.stats?.total_rounds} раундов</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'K/D', value: analysis.stats?.kd },
                  { label: 'ADR', value: analysis.stats?.adr },
                  { label: 'HS%', value: `${analysis.stats?.hs}%` },
                  { label: 'KAST', value: `${analysis.stats?.kast}%` },
                ].map((s, i) => (
                  <div key={i} className="bg-gray-800/50 rounded-xl p-4 text-center">
                    <p className="text-xl font-black">{s.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              {analysis.errors?.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
                  <p className="font-bold text-red-400 mb-3">⚠️ Найдено ошибок: {analysis.errors.length}</p>
                  <div className="space-y-2">
                    {analysis.errors.slice(0, 3).map((e: any, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                        <span>{e.icon}</span> {e.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <label className="block cursor-pointer">
                <input type="file" accept=".dem" className="hidden" onChange={handleFile} />
                <div className="px-5 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-sm font-medium text-center transition-colors">
                  Загрузить другую демку
                </div>
              </label>
            </div>
          ) : (
            <>
              <label className="block bg-gray-800/50 border-2 border-dashed border-gray-600 hover:border-red-500/50 rounded-2xl p-10 text-center cursor-pointer transition-all group">
                <input type="file" accept=".dem" className="hidden" onChange={handleFile} />
                <Swords size={48} className="text-red-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2">Загрузи .dem файл</h3>
                <p className="text-gray-400 text-sm mb-5">Premier или Faceit · до 300 МБ</p>
                <div className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl font-semibold inline-block text-sm">
                  Выбрать файл
                </div>
              </label>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 text-red-400 text-sm">
                  <AlertCircle size={18} className="flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="bg-gray-800/50 rounded-2xl p-5 space-y-3">
                <p className="text-sm font-semibold text-gray-400">Что получишь после анализа:</p>
                {[
                  'Сравнение с профи FaceIT 10 по K/D, ADR, KAST',
                  'Список ошибок с советами как исправить',
                  'Разбор каждого раунда с иконками',
                  'Карта смертей и убийств',
                ].map((t, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="text-red-400 flex-shrink-0">→</span> {t}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {tab === 'history' && (
        <div className="space-y-3">
          {history.length === 0 ? (
            <div className="bg-gray-800/50 rounded-2xl p-10 text-center">
              <Clock size={40} className="text-gray-700 mx-auto mb-3" />
              <p className="text-gray-400">История анализов пуста</p>
              <p className="text-xs text-gray-600 mt-1">Загрузи первую демку</p>
            </div>
          ) : (
            history.map((h: any, i: number) => (
              <div key={i} className="bg-gray-800/50 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{h.map || 'Карта неизвестна'}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {h.created_at ? new Date(h.created_at).toLocaleDateString('ru-RU') : '—'} ·
                    K/D {h.kd || '—'} · ADR {h.adr || '—'}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  (h.kd || 0) >= 1.2 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {(h.kd || 0) >= 1.2 ? 'Хорошо' : 'Есть над чем работать'}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

// ─── Highlights Tab ────────────────────────────────────────────────────────────
function HighlightsTab({ nickname }: { nickname: string }) {
  const [highlights, setHighlights] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!nickname) return
    fetch(`/api/highlights?nickname=${nickname}`)
      .then(r => r.json())
      .then(data => setHighlights(data.highlights || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [nickname])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black">Мои хайлайты</h2>
        <p className="text-gray-400 mt-1">Видео-клипы из твоих матчей</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" />
        </div>
      ) : highlights.length === 0 ? (
        <div className="bg-gray-800/50 border-2 border-dashed border-gray-700 rounded-2xl p-12 text-center">
          <Video size={48} className="text-gray-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Нет хайлайтов</h3>
          <p className="text-gray-400 text-sm mb-6">Загрузи демку — мы автоматически нарежем лучшие моменты</p>
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {['Загрузи .dem файл', '→', 'Генерация клипов', '→', 'Хайлайты готовы'].map((s, i) => (
                <span key={i} className={i % 2 === 1 ? 'text-gray-700' : ''}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {highlights.map((h: any) => (
            <div key={h.id} className="bg-gray-800/50 rounded-2xl overflow-hidden hover:bg-gray-800/80 transition-all group">
              <div className="relative aspect-video">
                <video src={h.video_url} controls className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <p className="font-semibold text-sm mb-2">{h.title || 'Без названия'}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{h.created_at ? new Date(h.created_at).toLocaleDateString('ru-RU') : '—'}</span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Heart size={12} /> {h.likes || 0}</span>
                    <a
                      href={h.video_url}
                      download
                      className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Download size={12} /> Скачать
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── ELO Tab ───────────────────────────────────────────────────────────────────
function EloTab({ faceit }: { faceit: any }) {
  const elo = faceit?.elo || 0
  const level = faceit?.level || 1

  const levels = [
    { level: 1, min: 0, max: 800, color: '#6b7280' },
    { level: 2, min: 801, max: 950, color: '#10b981' },
    { level: 3, min: 951, max: 1100, color: '#10b981' },
    { level: 4, min: 1101, max: 1250, color: '#3b82f6' },
    { level: 5, min: 1251, max: 1400, color: '#3b82f6' },
    { level: 6, min: 1401, max: 1550, color: '#8b5cf6' },
    { level: 7, min: 1551, max: 1700, color: '#8b5cf6' },
    { level: 8, min: 1701, max: 1850, color: '#f59e0b' },
    { level: 9, min: 1851, max: 2000, color: '#f59e0b' },
    { level: 10, min: 2001, max: 9999, color: '#ef4444' },
  ]

  const currentLevel = levels.find(l => elo >= l.min && elo <= l.max) || levels[0]
  const nextLevel = levels.find(l => l.level === currentLevel.level + 1)
  const progress = nextLevel
    ? Math.round(((elo - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100)
    : 100

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black">ELO Трекер</h2>
        <p className="text-gray-400 mt-1">Отслеживай рейтинг и прогресс</p>
      </div>

      {!faceit ? (
        <div className="bg-gray-800/50 rounded-2xl p-10 text-center">
          <TrendingUp size={48} className="text-gray-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Привяжи Faceit аккаунт</h3>
          <p className="text-gray-400 text-sm mb-6">Для отслеживания ELO нужен Faceit аккаунт</p>
          <Link href="/profile/setup" className="px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-xl font-semibold text-sm transition-colors inline-block">
            Привязать аккаунт
          </Link>
        </div>
      ) : (
        <>
          {/* Текущий уровень */}
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-800/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-gray-400 text-sm">Текущий ELO</p>
                <p className="text-4xl font-black mt-1" style={{ color: currentLevel.color }}>{elo}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">Уровень</p>
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black mt-1 border-2"
                  style={{ borderColor: currentLevel.color, color: currentLevel.color }}
                >
                  {level}
                </div>
              </div>
            </div>

            {/* Прогресс до след. уровня */}
            {nextLevel && (
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>Уровень {currentLevel.level}</span>
                  <span>{nextLevel.min - elo} ELO до уровня {nextLevel.level}</span>
                  <span>Уровень {nextLevel.level}</span>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${progress}%`, backgroundColor: currentLevel.color }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Уровни */}
          <div className="bg-gray-800/50 rounded-2xl p-5">
            <h3 className="font-bold mb-4 text-sm text-gray-400">Таблица уровней Faceit</h3>
            <div className="space-y-2">
              {levels.map(l => (
                <div
                  key={l.level}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                    l.level === currentLevel.level ? 'bg-gray-700/50 ring-1 ring-gray-500' : 'hover:bg-gray-700/30'
                  }`}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ backgroundColor: `${l.color}20`, color: l.color }}
                  >
                    {l.level}
                  </div>
                  <div className="flex-1">
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: l.level === currentLevel.level ? `${progress}%` : l.level < currentLevel.level ? '100%' : '0%',
                          backgroundColor: l.color
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 w-24 text-right">
                    {l.max === 9999 ? `${l.min}+` : `${l.min}–${l.max}`}
                  </span>
                  {l.level === currentLevel.level && (
                    <span className="text-xs font-bold" style={{ color: l.color }}>Ты здесь</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/50 rounded-2xl p-5">
              <p className="text-xs text-gray-500 mb-1">Матчей сыграно</p>
              <p className="text-2xl font-black">{faceit.stats?.lifetime?.['Matches'] || '—'}</p>
            </div>
            <div className="bg-gray-800/50 rounded-2xl p-5">
              <p className="text-xs text-gray-500 mb-1">Винрейт</p>
              <p className="text-2xl font-black">{faceit.stats?.lifetime?.['Win Rate %'] || '—'}%</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Main Cabinet Page ─────────────────────────────────────────────────────────
export default function CabinetPage() {
  const [nickname, setNickname] = useState('')
  const [faceit, setFaceit] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('currentNickname')
    if (saved) {
      setNickname(saved)
      fetch(`/api/faceit?nickname=${saved}`)
        .then(r => r.json())
        .then(data => setFaceit(data))
        .catch(() => {})
    }
  }, [])

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab nickname={nickname} faceit={faceit} />
      case 'demos': return <DemosTab />
      case 'highlights': return <HighlightsTab nickname={nickname} />
      case 'elo': return <EloTab faceit={faceit} />
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white flex">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-gray-800 p-2 rounded-xl"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <Sidebar
        nickname={nickname}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1 p-6 md:p-10 max-w-4xl">
        {renderTab()}
      </main>
    </div>
  )
}
