'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Info, Bell, Users, Flame, Target, Dumbbell, BarChart3,
  ChevronRight, Trophy, Swords, TrendingUp, Star, Zap,
  Menu, X, Play, ArrowRight, Shield
} from 'lucide-react'
import { AnalysisSection } from '@/components/analysis-section'
import { TeamSection } from '@/components/team-section'

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
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-gray-800 p-2 rounded-xl"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

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
          <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            UFUTURE
          </h1>
          <p className="text-xs text-gray-500 mt-1">Киберспортивная платформа</p>
        </div>

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

      <main className="flex-1 p-6 md:p-10 max-w-4xl">
        <ActiveComponent />
      </main>
    </div>
  )
}