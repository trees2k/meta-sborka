'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Info, Bell, Users, Flame, Target, Dumbbell, BarChart3,
  ChevronRight, Trophy, Swords, TrendingUp, Star, Zap,
  Menu, X, Play, ArrowRight, Shield
} from 'lucide-react'

const menuItems = [
  { id: 'info', label: 'Информация', icon: Info, color: 'from-blue-500 to-cyan-500' },
  { id: 'updates', label: 'Обновления', icon: Bell, color: 'from-purple-500 to-pink-500' },
  { id: 'team', label: 'Подбор команды', icon: Users, color: 'from-green-500 to-emerald-500' },
  { id: 'warmup', label: 'Разминка', icon: Flame, color: 'from-orange-500 to-red-500' },
  { id: 'lineups', label: 'Раскидка', icon: Target, color: 'from-yellow-500 to-amber-500' },
  { id: 'training', label: 'Тренировка', icon: Dumbbell, color: 'from-indigo-500 to-violet-500' },
  { id: 'stats', label: 'Статистика', icon: BarChart3, color: 'from-rose-500 to-pink-500' },
  { id: 'analysis', label: 'Разбор ошибок', icon: Swords, color: 'from-red-500 to-orange-500' },
]

function InfoSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-black">Добро пожаловать в Ufuture</h2>
      <p className="text-gray-400 text-lg">Киберспортивная платформа для игроков CS2</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/20 rounded-2xl p-6">
          <Trophy className="text-blue-400 mb-3" size={32} />
          <h3 className="font-bold text-lg mb-1">Анализ демок</h3>
          <p className="text-gray-400 text-sm">Загрузите демку и получите детальную статистику матча</p>
        </div>
        <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/20 rounded-2xl p-6">
          <Zap className="text-purple-400 mb-3" size={32} />
          <h3 className="font-bold text-lg mb-1">Хайлайты</h3>
          <p className="text-gray-400 text-sm">Автоматическая нарезка лучших моментов из матчей</p>
        </div>
        <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/20 rounded-2xl p-6">
          <Users className="text-green-400 mb-3" size={32} />
          <h3 className="font-bold text-lg mb-1">Подбор команды</h3>
          <p className="text-gray-400 text-sm">Найди тиммейтов по рангу, ролям и стилю игры</p>
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-2xl p-6">
        <h3 className="font-bold text-xl mb-4">Быстрый старт</h3>
        <div className="space-y-3">
          <Link href="/cabinet" className="flex items-center justify-between bg-gray-900/50 hover:bg-gray-700/50 rounded-xl p-4 transition-all group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <BarChart3 size={20} className="text-blue-400" />
              </div>
              <div>
                <p className="font-semibold">Открыть кабинет</p>
                <p className="text-sm text-gray-400">Анализ демок, ELO трекер, хайлайты</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-500 group-hover:text-white transition-colors" />
          </Link>

          <Link href="/highlights" className="flex items-center justify-between bg-gray-900/50 hover:bg-gray-700/50 rounded-xl p-4 transition-all group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
                <Play size={20} className="text-pink-400" />
              </div>
              <div>
                <p className="font-semibold">Лента хайлайтов</p>
                <p className="text-sm text-gray-400">Смотрите лучшие моменты игроков</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-500 group-hover:text-white transition-colors" />
          </Link>

          <Link href="/anketa" className="flex items-center justify-between bg-gray-900/50 hover:bg-gray-700/50 rounded-xl p-4 transition-all group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Users size={20} className="text-green-400" />
              </div>
              <div>
                <p className="font-semibold">Найти команду</p>
                <p className="text-sm text-gray-400">Заполни анкету и найди тиммейтов</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-500 group-hover:text-white transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  )
}

function UpdatesSection() {
  const updates = [
    { date: '18.05.2026', title: 'Видео-клипы хайлайтов', desc: 'Теперь при загрузке демки автоматически генерируются видео-клипы лучших моментов', tag: 'Новое', tagColor: 'bg-green-500' },
    { date: '17.05.2026', title: 'Лента хайлайтов', desc: 'Добавлена лента хайлайтов в стиле Reels с лайками и комментариями', tag: 'Новое', tagColor: 'bg-green-500' },
    { date: '17.05.2026', title: 'Анализ демок', desc: 'Реальный парсинг демок CS2 через VPS. Показывает K/D, ADR, KAST, HS%, клатчи', tag: 'Улучшено', tagColor: 'bg-blue-500' },
    { date: '15.05.2026', title: 'Профиль игрока', desc: 'Привязка Faceit, отслеживание ELO, цели на месяц', tag: 'Новое', tagColor: 'bg-green-500' },
    { date: '12.05.2026', title: 'Telegram бот', desc: '@Metasborka_bot — получайте уведомления о матчах', tag: 'Бета', tagColor: 'bg-purple-500' },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-black">Обновления</h2>
      <p className="text-gray-400">Последние изменения на платформе</p>
      <div className="space-y-4">
        {updates.map((u, i) => (
          <div key={i} className="bg-gray-800/50 rounded-2xl p-5 hover:bg-gray-800/80 transition-all">
            <div className="flex items-center gap-3 mb-2">
              <span className={`${u.tagColor} text-xs px-2 py-1 rounded-full font-semibold`}>{u.tag}</span>
              <span className="text-gray-500 text-sm">{u.date}</span>
            </div>
            <h3 className="font-bold text-lg">{u.title}</h3>
            <p className="text-gray-400 text-sm mt-1">{u.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function TeamSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-black">Подбор команды</h2>
      <p className="text-gray-400">Найди тиммейтов для CS2</p>
      <div className="bg-gray-800/50 rounded-2xl p-8 text-center">
        <Users size={64} className="text-green-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Заполни анкету</h3>
        <p className="text-gray-400 mb-6">Укажи свой ранг, роли, время игры — и мы подберём идеальных тиммейтов</p>
        <Link href="/anketa" className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-xl font-semibold inline-block transition-all">
          Заполнить анкету
        </Link>
      </div>
    </div>
  )
}

function WarmupSection() {
  const routines = [
    { name: 'Аим тренировка', time: '15 мин', desc: 'DM + Workshop карты для разогрева', icon: '🎯' },
    { name: 'Спрей контроль', time: '10 мин', desc: 'Тренировка контроля отдачи АК-47 и M4', icon: '💥' },
    { name: 'Флики и реакция', time: '10 мин', desc: 'Aim Botz + Fast Aim / Reflex Training', icon: '⚡' },
    { name: 'Пистолетный раунд', time: '5 мин', desc: 'USP/Glock/Deagle на Pistol DM', icon: '🔫' },
    { name: 'Движение', time: '10 мин', desc: 'KZ/Surf для улучшения мувмента', icon: '🏃' },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-black">Разминка</h2>
      <p className="text-gray-400">Прогрей аим перед игрой</p>
      <div className="space-y-3">
        {routines.map((r, i) => (
          <div key={i} className="bg-gray-800/50 rounded-2xl p-5 flex items-center gap-4 hover:bg-gray-800/80 transition-all">
            <span className="text-3xl">{r.icon}</span>
            <div className="flex-1">
              <h3 className="font-bold">{r.name}</h3>
              <p className="text-gray-400 text-sm">{r.desc}</p>
            </div>
            <span className="text-sm text-gray-500 bg-gray-700/50 px-3 py-1 rounded-full">{r.time}</span>
          </div>
        ))}
      </div>
      <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/20 rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-2">💡 Совет</h3>
        <p className="text-gray-300 text-sm">Разминайся минимум 20 минут перед рейтинговой игрой. Это повысит твой винрейт на 15-20%.</p>
      </div>
    </div>
  )
}

function LineupsSection() {
  const maps = [
    { name: 'Mirage', smokes: 24, flashes: 18, molotovs: 12, img: '🏜️' },
    { name: 'Dust 2', smokes: 20, flashes: 15, molotovs: 10, img: '🌵' },
    { name: 'Inferno', smokes: 22, flashes: 16, molotovs: 14, img: '🔥' },
    { name: 'Ancient', smokes: 18, flashes: 12, molotovs: 8, img: '🏛️' },
    { name: 'Nuke', smokes: 16, flashes: 14, molotovs: 10, img: '☢️' },
    { name: 'Anubis', smokes: 14, flashes: 10, molotovs: 8, img: '🐍' },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-black">Раскидка</h2>
      <p className="text-gray-400">Гранаты для каждой карты</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {maps.map((m, i) => (
          <div key={i} className="bg-gray-800/50 rounded-2xl p-5 hover:bg-gray-800/80 transition-all cursor-pointer group">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{m.img}</span>
              <h3 className="font-bold text-lg">{m.name}</h3>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div className="bg-gray-700/50 rounded-lg p-2">
                <p className="font-bold text-white">{m.smokes}</p>
                <p className="text-gray-400 text-xs">Смоки</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-2">
                <p className="font-bold text-yellow-400">{m.flashes}</p>
                <p className="text-gray-400 text-xs">Флешки</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-2">
                <p className="font-bold text-orange-400">{m.molotovs}</p>
                <p className="text-gray-400 text-xs">Молотовы</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-gray-500 text-sm text-center">🚧 Раздел в разработке. Скоро добавим видео-гайды по раскидкам.</p>
    </div>
  )
}

function TrainingSection() {
  const plans = [
    { level: 'Новичок', elo: '1-3 lvl', tasks: ['Изучи базовые смоки Mirage', 'Тренируй спрей AK-47', 'Играй 5 DM в день', 'Смотри демки про-игроков'], color: 'from-green-500 to-emerald-600' },
    { level: 'Средний', elo: '4-7 lvl', tasks: ['Изучи все смоки на 2 картах', 'Играй Faceit Premium', 'Работай над позиционированием', 'Анализируй свои демки'], color: 'from-blue-500 to-indigo-600' },
    { level: 'Продвинутый', elo: '8-10 lvl', tasks: ['Раскидки на все карты', 'Командные тактики', 'Анти-эко стратегии', 'Ментальная подготовка'], color: 'from-purple-500 to-pink-600' },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-black">Тренировка</h2>
      <p className="text-gray-400">Планы тренировок по уровням</p>
      <div className="space-y-4">
        {plans.map((p, i) => (
          <div key={i} className={`bg-gradient-to-r ${p.color} rounded-2xl p-6`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-black text-xl">{p.level}</h3>
                <p className="text-white/70 text-sm">{p.elo}</p>
              </div>
              <Shield size={32} className="text-white/30" />
            </div>
            <div className="space-y-2">
              {p.tasks.map((t, j) => (
                <div key={j} className="flex items-center gap-2 bg-black/20 rounded-lg px-3 py-2">
                  <div className="w-5 h-5 border-2 border-white/40 rounded-md flex-shrink-0" />
                  <span className="text-sm">{t}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatsSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-black">Статистика</h2>
      <p className="text-gray-400">Отслеживай свой прогресс</p>
      <div className="bg-gray-800/50 rounded-2xl p-8 text-center">
        <BarChart3 size={64} className="text-blue-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Введи никнейм Faceit</h3>
        <p className="text-gray-400 mb-6">Получи полную статистику, ELO график и анализ игры</p>
        <Link href="/cabinet" className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold inline-block transition-all">
          Открыть кабинет
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/highlights" className="bg-gradient-to-br from-pink-600/20 to-purple-600/20 border border-pink-500/20 rounded-2xl p-6 hover:border-pink-500/40 transition-all">
          <Play size={28} className="text-pink-400 mb-2" />
          <h3 className="font-bold">Хайлайты</h3>
          <p className="text-gray-400 text-sm">Смотрите лучшие моменты</p>
        </Link>
        <Link href="/blog" className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/20 rounded-2xl p-6 hover:border-blue-500/40 transition-all">
          <Star size={28} className="text-blue-400 mb-2" />
          <h3 className="font-bold">Блог</h3>
          <p className="text-gray-400 text-sm">Гайды и советы</p>
        </Link>
      </div>
    </div>
  )
}
function AnalysisSection() {
  const [tab, setTab] = useState<'overview'|'rounds'|'errors'|'map'>('overview')
  const [openErr, setOpenErr] = useState<number|null>(0)
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const [error, setError] = useState<string|null>(null)

  const tabs = [
    { id: 'overview', label: 'Обзор' },
    { id: 'rounds',   label: 'По раундам' },
    { id: 'errors',   label: 'Ошибки' },
    { id: 'map',      label: 'Карта' },
  ] as const

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    setError(null)
    setAnalysis(null)

    try {
      const form = new FormData()
      form.append('file', file)

      const res = await fetch('/api/demo/analysis', {
        method: 'POST',
        body: form,
      })
      const json = await res.json()

      if (json.status === 'ok') {
        setAnalysis(json.analysis)
      } else {
        setError(json.detail || json.error || 'Ошибка анализа')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const stats = analysis ? [
    { label: 'K/D',     you: String(analysis.stats.kd),    pro: '1.2',  youW: Math.min(analysis.stats.kd * 25, 100), proW: 55, good: analysis.stats.kd >= 1.2 },
    { label: 'ADR',     you: String(analysis.stats.adr),   pro: '85',   youW: Math.min(analysis.stats.adr, 100),      proW: 60, good: analysis.stats.adr >= 85 },
    { label: 'HS%',     you: `${analysis.stats.hs}%`,      pro: '50%',  youW: analysis.stats.hs,                      proW: 50, good: analysis.stats.hs >= 50 },
    { label: 'Утилита', you: String(analysis.stats.utility_damage), pro: '40+', youW: Math.min(analysis.stats.utility_damage * 2, 100), proW: 40, good: analysis.stats.utility_damage >= 30 },
    { label: 'KAST',    you: `${analysis.stats.kast}%`,   pro: '73%',  youW: analysis.stats.kast,                    proW: 73, good: analysis.stats.kast >= 73 },
  ] : []

  // Экран загрузки демки
  if (!analysis && !loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-black">Разбор ошибок</h2>
          <p className="text-gray-400 mt-1">Загрузи демку — получишь детальный разбор с картой и советами</p>
        </div>

        <label className="block bg-gray-800/50 border-2 border-dashed border-gray-600 hover:border-red-500/50 rounded-2xl p-12 text-center cursor-pointer transition-all group">
          <input type="file" accept=".dem" className="hidden" onChange={handleFile} />
          <Swords size={48} className="text-red-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-xl font-bold mb-2">Загрузи демку CS2</h3>
          <p className="text-gray-400 text-sm">Файл .dem · Premier или Faceit</p>
          <div className="mt-6 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl font-semibold inline-block">
            Выбрать файл
          </div>
        </label>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-400 text-sm">
            ⚠️ {error}
          </div>
        )}

        <div className="bg-gray-800/50 rounded-2xl p-5 space-y-3">
          <p className="text-sm text-gray-400 font-semibold">Что получишь после анализа:</p>
          {[
            'Сравнение твоих показателей с профи FaceIT 10',
            'Список ошибок с советами как исправить',
            'Разбор каждого раунда где умер',
            'Карта с позициями смертей и убийств',
          ].map((t, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
              <span className="text-red-400">→</span> {t}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Экран загрузки
  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-black">Разбор ошибок</h2>
        <div className="bg-gray-800/50 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-6"/>
          <h3 className="text-xl font-bold mb-2">Анализируем демку...</h3>
          <p className="text-gray-400 text-sm">Может занять 2-5 минут</p>
          <div className="mt-6 space-y-2 text-sm text-gray-500">
            <p>⚙️ Парсинг событий матча</p>
            <p>🗺️ Обработка позиций на карте</p>
            <p>🧠 Анализ ошибок</p>
          </div>
        </div>
      </div>
    )
  }

  // Результаты
  const s = analysis.stats
  const errors = analysis.errors || []
  const rounds = analysis.rounds || []
  const deaths = analysis.deaths || []
  const kills = analysis.kills || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-3xl font-black">Разбор ошибок</h2>
          <p className="text-gray-400 mt-1">{s.nickname} — {s.map} · {s.total_rounds} раундов · {s.kills}/{s.deaths}/{s.assists}</p>
        </div>
        <div className="flex items-center gap-3">
          {errors.length > 0 && (
            <span className="bg-red-500/20 text-red-400 text-sm px-3 py-1 rounded-full font-semibold">
              {errors.length} ошибок найдено
            </span>
          )}
          <label className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-xl text-sm cursor-pointer transition-all">
            <input type="file" accept=".dem" className="hidden" onChange={handleFile} />
            Новая демка
          </label>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
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

      {/* ОБЗОР */}
      {tab === 'overview' && (
        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-2xl p-6">
            <p className="text-sm text-gray-400 mb-4">Твои показатели vs профи (FaceIT Lvl 10)</p>
            <div className="flex gap-4 text-xs text-gray-500 mb-4">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"/>Ты</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block"/>Про / норма</span>
            </div>
            <div className="space-y-3">
              {stats.map((s, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span className="w-20 text-right text-gray-400 text-xs flex-shrink-0">{s.label}</span>
                  <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${s.good ? 'bg-emerald-500' : 'bg-red-500'}`} style={{width:`${s.youW}%`}}/>
                  </div>
                  <span className={`w-14 text-right font-semibold text-xs ${s.good ? 'text-emerald-400' : 'text-red-400'}`}>{s.you}</span>
                  <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-blue-500" style={{width:`${s.proW}%`}}/>
                  </div>
                  <span className="w-10 text-right text-gray-500 text-xs">{s.pro}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5">
              <p className="text-sm text-gray-400 mb-3">Сильные стороны</p>
              {stats.filter(s => s.good).map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-emerald-400 mb-1">
                  <span>✓</span> {s.label}: {s.you}
                </div>
              ))}
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
              <p className="text-sm text-gray-400 mb-3">Зоны роста</p>
              {stats.filter(s => !s.good).map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-red-400 mb-1">
                  <span>✗</span> {s.label}: {s.you} (норма: {s.pro})
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ПО РАУНДАМ */}
      {tab === 'rounds' && (
        <div className="bg-gray-800/50 rounded-2xl divide-y divide-gray-700/50">
          {rounds.length === 0 && (
            <div className="p-6 text-center text-gray-400 text-sm">Нет данных по раундам</div>
          )}
          {rounds.map((r: any, i: number) => (
            <div key={i} className="flex items-center gap-3 px-5 py-4">
              <span className="text-gray-500 text-sm w-6">{r.n}</span>
              <span>{r.icon}</span>
              <span className="flex-1 text-sm">{r.info}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${r.tagColor}`}>{r.tag}</span>
              {r.time && <span className="text-xs text-gray-500 w-10 text-right">{r.time}</span>}
            </div>
          ))}
        </div>
      )}

      {/* ОШИБКИ */}
      {tab === 'errors' && (
        <div className="space-y-3">
          {errors.length === 0 && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center text-emerald-400">
              🎉 Ошибок не найдено — отличная игра!
            </div>
          )}
          {errors.map((e: any, i: number) => (
            <div key={i} className="bg-gray-800/50 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenErr(openErr === i ? null : i)}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-700/30 transition-all text-left"
              >
                <span className="text-2xl">{e.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">{e.title}</span>
                    <span className={`${e.labelColor} text-xs px-2 py-0.5 rounded-full text-white`}>{e.label}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{e.sub}</p>
                </div>
                <span className={`text-gray-500 transition-transform ${openErr === i ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {openErr === i && (
                <div className="px-5 pb-5 space-y-3">
                  <p className="text-sm text-gray-300 leading-relaxed">{e.desc}</p>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                    <p className="text-xs text-blue-400 font-semibold mb-1">👥 Как делают про</p>
                    <p className="text-sm text-gray-300">{e.pro}</p>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                    <p className="text-xs text-emerald-400 font-semibold mb-1">💡 Что делать</p>
                    <p className="text-sm text-gray-300">{e.advice}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* КАРТА */}
      {tab === 'map' && (
        <div className="space-y-4">
          <div className="bg-gray-900 rounded-2xl p-4">
            <p className="text-xs text-gray-500 mb-3">{s.map} — {deaths.length} смертей · {kills.length} убийств</p>
            <svg viewBox="0 0 500 500" className="w-full rounded-xl">
              <rect width="500" height="500" fill="#1a1f2e" rx="8"/>
              <rect x="40" y="40" width="420" height="420" fill="#1e2535" rx="4"/>
              <text x="250" y="250" fill="#2a3550" fontSize="14" textAnchor="middle">
                Карта: {s.map}
              </text>
              {/* Убийства */}
              {kills.slice(0, 30).map((k: any, i: number) => {
                // Нормализуем координаты CS2 в SVG (примерный диапазон)
                const svgX = Math.min(Math.max(((k.x + 2000) / 4000) * 420 + 40, 40), 460)
                const svgY = Math.min(Math.max(((k.y + 2000) / 4000) * 420 + 40, 40), 460)
                return <circle key={i} cx={svgX} cy={svgY} r="6" fill="#0f6e56" stroke="#1d9e75" strokeWidth="1.5" opacity="0.8"/>
              })}
              {/* Смерти */}
              {deaths.map((d: any, i: number) => {
                const svgX = Math.min(Math.max(((d.x + 2000) / 4000) * 420 + 40, 40), 460)
                const svgY = Math.min(Math.max(((d.y + 2000) / 4000) * 420 + 40, 40), 460)
                return <circle key={i} cx={svgX} cy={svgY} r="9" fill="#7f1515" stroke="#e24b4a" strokeWidth="2" opacity="0.9"/>
              })}
            </svg>
          </div>
          <div className="flex gap-4 flex-wrap text-xs text-gray-400">
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"/>Смерть ({deaths.length})</span>
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"/>Убийство ({kills.length})</span>
          </div>
        </div>
      )}
    </div>
  )
}

const sections: Record<string, () => React.ReactNode> = {
  info: InfoSection,
  updates: UpdatesSection,
  team: TeamSection,
  warmup: WarmupSection,
  lineups: LineupsSection,
  training: TrainingSection,
  stats: StatsSection,
  analysis: AnalysisSection,
}

export default function Home() {
  const [activeSection, setActiveSection] = useState('info')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [nickname, setNickname] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('currentNickname')
    if (saved) setNickname(saved)
  }, [])

  const ActiveComponent = sections[activeSection]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white flex">
      {/* Мобильная кнопка меню */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-gray-800 p-2 rounded-xl"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Оверлей для мобильного */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Сайдбар */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-72 bg-gray-950/95 backdrop-blur-md
        border-r border-gray-800/50 flex flex-col z-40
        transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Логотип */}
        <div className="p-6 border-b border-gray-800/50">
          <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            UFUTURE
          </h1>
          <p className="text-xs text-gray-500 mt-1">Киберспортивная платформа</p>
        </div>

        {/* Меню */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            return (
              <button
                key={item.id}
                onClick={() => { setActiveSection(item.id); setSidebarOpen(false) }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all
                  ${isActive
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Нижняя часть */}
        <div className="p-4 border-t border-gray-800/50 space-y-2">
          <Link href="/highlights" className="flex items-center gap-2 px-4 py-2 text-sm text-pink-400 hover:bg-gray-800/50 rounded-xl transition-all">
            <Play size={16} /> Хайлайты
          </Link>
          <Link href="/cabinet" className="flex items-center gap-2 px-4 py-2 text-sm text-blue-400 hover:bg-gray-800/50 rounded-xl transition-all">
            <BarChart3 size={16} /> Кабинет
          </Link>
          <Link href="/blog" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:bg-gray-800/50 rounded-xl transition-all">
            <Star size={16} /> Блог
          </Link>

          {nickname && (
            <Link href={`/profile/${nickname}`} className="flex items-center gap-2 px-4 py-3 bg-gray-800/50 rounded-xl mt-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold">
                {nickname[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold">{nickname}</p>
                <p className="text-xs text-gray-500">Профиль</p>
              </div>
            </Link>
          )}
        </div>
      </aside>

      {/* Контент */}
      <main className="flex-1 p-6 md:p-10 max-w-4xl">
        <ActiveComponent />
      </main>
    </div>
  )
}