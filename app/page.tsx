'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Info, Bell, Users, Flame, Target, Dumbbell, BarChart3,
  ChevronRight, Trophy, Swords, TrendingUp, Star, Zap,
  Menu, X, Play, ArrowRight, Shield, MessageCircle, Search
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

function SearchUsers() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    if (!query.trim()) { setResults([]); setShowResults(false); return }
    const timer = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data.users || [])
        setShowResults(true)
      } catch {
        setResults([])
      } finally {
        setSearching(false)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="relative">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          placeholder="Поиск игроков..."
          className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-8 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
        {searching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        )}
      </div>

      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-xl overflow-hidden z-50 shadow-xl">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-500">Никого не найдено</p>
          ) : (
            results.map((u: any) => (
              <Link
                key={u.id}
                href={`/profile/${u.faceit_nickname}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors"
              >
                <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {u.faceit_nickname?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <p className="text-sm font-semibold">{u.faceit_nickname}</p>
                  <p className="text-xs text-gray-500">Игрок</p>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  )
}

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
    { date: '06.06.2026', title: 'Верификация Faceit аккаунта', desc: 'Никнейм подтверждается через Steam ID — никто не может занять чужой аккаунт', tag: 'Новое', tagColor: 'bg-green-500' },
    { date: '05.06.2026', title: 'Подбор команды', desc: 'Умный матчмейкинг по роли, стилю общения, психотипу и ELO. После анкеты сразу показывает подходящих тиммейтов', tag: 'Новое', tagColor: 'bg-green-500' },
    { date: '04.06.2026', title: 'Страница сообщений', desc: 'Полноценный мессенджер — список диалогов, история сообщений, поиск по никнейму', tag: 'Новое', tagColor: 'bg-green-500' },
    { date: '03.06.2026', title: 'Новый профиль и кабинет', desc: 'Переработан дизайн профиля — счётчики лайков, хайлайтов, подписчиков. Кабинет с ELO трекером и историей демок', tag: 'Улучшено', tagColor: 'bg-blue-500' },
    { date: '02.06.2026', title: 'Разбор демок — новый UI', desc: 'Пошаговая инструкция по загрузке демки с Faceit. Drag & drop файлов без перезагрузки страницы', tag: 'Улучшено', tagColor: 'bg-blue-500' },
    { date: '01.06.2026', title: 'Видео-клипы хайлайтов', desc: 'При загрузке демки автоматически генерируются видео-клипы лучших моментов', tag: 'Новое', tagColor: 'bg-green-500' },
    { date: '31.05.2026', title: 'Лента хайлайтов', desc: 'Лента хайлайтов в стиле Reels с лайками и комментариями', tag: 'Новое', tagColor: 'bg-green-500' },
    { date: '30.05.2026', title: 'Telegram бот', desc: '@Metasborka_bot — получайте уведомления о матчах', tag: 'Бета', tagColor: 'bg-purple-500' },
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
  { name: 'Аим тренировка', time: '15 мин', desc: 'DM + Workshop карты для разогрева', icon: '🎯', workshop: '243702660' },
  { name: 'Спрей контроль', time: '10 мин', desc: 'Тренировка контроля отдачи АК-47 и M4', icon: '💥', workshop: '419404847' },
  { name: 'Флики и реакция', time: '10 мин', desc: 'Aim Botz + Fast Aim / Reflex Training', icon: '⚡', workshop: '368026786' },
  { name: 'Пистолетный раунд', time: '5 мин', desc: 'USP/Glock/Deagle на Pistol DM', icon: '🔫', workshop: '243702660' },
  { name: 'Движение', time: '10 мин', desc: 'KZ/Surf для улучшения мувмента', icon: '🏃', workshop: '313953000' },
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
            <a
            href={`https://steamcommunity.com/sharedfiles/filedetails/?id=${r.workshop}`}
  target="_blank"
  rel="noopener noreferrer"
  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 rounded-xl text-sm font-semibold transition-all flex-shrink-0"
>
  Открыть
</a>
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
  const [selectedMap, setSelectedMap] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('insta')

  const maps = [
    { name: 'Mirage', img: '🏜️' },
    { name: 'Dust 2', img: '🌵' },
    { name: 'Inferno', img: '🔥' },
    { name: 'Ancient', img: '🏛️' },
    { name: 'Nuke', img: '☢️' },
    { name: 'Anubis', img: '🐍' },
  ]

  const tabs = [
    { id: 'insta', label: 'Инста смоки' },
    { id: 'second', label: 'Выход на плент' },
    { id: 'fake', label: 'Фейк смоки' },
    { id: 'flash', label: 'Флешки' },
    { id: 'molotov', label: 'Молотовы' },
  ]

  const lineups: Record<string, Record<string, any[]>> = {
    'Mirage': {
      insta: [
        { name: 'Смок CT', pos: 'Т спавн, угол дома', throw: 'Прыжок + бросок', desc: 'Встань в угол между домом и забором на Т спавне. Прицелься в верхний край крыши дома. Прыжок + бросок.' },
        { name: 'Смок Jungle', pos: 'Середина T спавна', throw: 'Обычный бросок', desc: 'Встань по центру Т спавна у ящиков. Прицелься в левый край антенны. Обычный бросок без прыжка.' },
        { name: 'Смок Stairs', pos: 'Т спавн, левая сторона', throw: 'Бросок с места', desc: 'Встань у левого края выхода с Т спавна. Прицелься в правый угол крыши лестниц. Бросок с места.' },
      ],
      second: [
        { name: 'Смок Short', pos: 'Мид, за ящиком', throw: 'Прыжок + бросок', desc: 'Зайди на мид, встань за большим ящиком. Прицелься в антенну слева. Прыжок + бросок закрывает шорт.' },
        { name: 'Смок A main', pos: 'Ramp вход', throw: 'Обычный бросок', desc: 'Встань у входа на рампу слева. Прицелься в правый угол крыши рампы. Обычный бросок.' },
      ],
      fake: [
        { name: 'Фейк B смок', pos: 'Т спавн', throw: 'Обычный бросок', desc: 'Бросок смока в сторону B апарта создаёт иллюзию захода на B пока команда идёт на A.' },
      ],
      flash: [
        { name: 'Флешка через рампу', pos: 'Вход на рампу', throw: 'Бросок через угол', desc: 'Встань у стены входа на рампу. Бросок через угол здания ослепляет игроков на A сайте.' },
        { name: 'Флешка B апарт', pos: 'Т спавн', throw: 'Высокий бросок', desc: 'Высокий бросок через здание ослепляет игроков в B апарте при заходе.' },
      ],
      molotov: [
        { name: 'Молотов CT', pos: 'Рампа', throw: 'Обычный бросок', desc: 'С рампы бросок молотова на позицию CT выбивает игроков с угла при захвате A.' },
        { name: 'Молотов Jungle', pos: 'Мид', throw: 'Прыжок + бросок', desc: 'С мида прыжок + бросок поджигает Jungle и выбивает игроков при захвате мида.' },
      ],
    },
    'Dust 2': {
      insta: [
        { name: 'Смок Xbox', pos: 'Т спавн мид', throw: 'Обычный бросок', desc: 'Встань у выхода с Т спавна на мид. Прицелься в левый угол Xbox. Обычный бросок закрывает Xbox.' },
        { name: 'Смок CT', pos: 'Long, угол', throw: 'Прыжок + бросок', desc: 'Встань у угла выхода на Long. Прицелься в верх CT спавна. Прыжок + бросок.' },
      ],
      second: [
        { name: 'Смок Short', pos: 'Мид', throw: 'Бросок с места', desc: 'С мида бросок закрывает выход CT со Short на A сайт при захвате.' },
      ],
      fake: [
        { name: 'Фейк Long смок', pos: 'Т спавн', throw: 'Обычный бросок', desc: 'Смок в сторону Long при заходе на B создаёт давление на двух направлениях.' },
      ],
      flash: [
        { name: 'Флешка Long', pos: 'Выход на Long', throw: 'Высокий бросок', desc: 'Высокий бросок ослепляет игроков за ящиками на Long при выходе.' },
      ],
      molotov: [
        { name: 'Молотов Short', pos: 'Мид', throw: 'Прыжок + бросок', desc: 'С мида поджигает Short угол при захвате A через мид.' },
      ],
    },
  }

  const currentLineups = selectedMap ? lineups[selectedMap] : null
  const currentGrenades = currentLineups ? (currentLineups[activeTab] || []) : []

  if (selectedMap) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelectedMap(null)} className="text-gray-400 hover:text-white text-sm transition-colors">← Назад</button>
          <h2 className="text-3xl font-black">Раскидка — {selectedMap}</h2>
        </div>

        <div className="flex gap-2 flex-wrap">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === t.id
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {!lineups[selectedMap] ? (
          <div className="bg-gray-800/50 rounded-2xl p-10 text-center">
            <p className="text-4xl mb-3">🚧</p>
            <p className="text-gray-400">Раскидки для {selectedMap} скоро будут добавлены</p>
          </div>
        ) : currentGrenades.length === 0 ? (
          <div className="bg-gray-800/50 rounded-2xl p-10 text-center">
            <p className="text-4xl mb-3">🚧</p>
            <p className="text-gray-400">Раздел в разработке</p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentGrenades.map((g: any, i: number) => (
              <div key={i} className="bg-gray-800/50 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">{g.name}</h3>
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full">{g.throw}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-900/50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">📍 Позиция</p>
                    <p className="text-sm font-medium">{g.pos}</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">🎯 Бросок</p>
                    <p className="text-sm font-medium">{g.throw}</p>
                  </div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                  <p className="text-sm text-gray-300">{g.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-black">Раскидка</h2>
      <p className="text-gray-400">Выбери карту чтобы изучить гранаты</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {maps.map((m, i) => (
          <button
            key={i}
            onClick={() => { setSelectedMap(m.name); setActiveTab('insta') }}
            className="bg-gray-800/50 hover:bg-gray-800/80 rounded-2xl p-6 text-left transition-all border border-gray-700/50 hover:border-yellow-500/30"
          >
            <span className="text-4xl mb-3 block">{m.img}</span>
            <h3 className="font-bold text-lg">{m.name}</h3>
            <p className="text-xs text-gray-500 mt-1">
              {lineups[m.name] ? 'Доступно' : '🚧 Скоро'}
            </p>
          </button>
        ))}
      </div>
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
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

useEffect(() => {
  const checkUnread = () => {
    fetch('/api/messages/unread')
      .then(r => r.json())
      .then(data => setUnreadCount(data.count || 0))
      .catch(() => {})
  }
  checkUnread()
  const interval = setInterval(checkUnread, 30000) // каждые 30 сек
  return () => clearInterval(interval)
}, [])

  useEffect(() => {
    const saved = localStorage.getItem('currentNickname')
    if (saved) setNickname(saved)

    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data.user) {
          setIsLoggedIn(true)
          if (data.user.faceit_nickname) {
            setNickname(data.user.faceit_nickname)
            localStorage.setItem('currentNickname', data.user.faceit_nickname)
          }
        } else {
          setIsLoggedIn(false)
          setNickname('')
          localStorage.removeItem('currentNickname')
        }
      })
      .catch(() => {})
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
        {/* Логотип */}
        <div className="p-6 border-b border-gray-800/50">
          <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            UFUTURE
          </h1>
          <p className="text-xs text-gray-500 mt-1">Киберспортивная платформа</p>
        </div>

        {/* Поиск */}
        <div className="px-4 py-3 border-b border-gray-800/50">
          <SearchUsers />
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
          <Link href="/messages" className="flex items-center gap-2 px-4 py-2 text-sm text-blue-400 hover:bg-gray-800/50 rounded-xl transition-all">
  <div className="relative">
    <MessageCircle size={16} />
    {unreadCount > 0 && (
      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
        {unreadCount > 9 ? '9+' : unreadCount}
      </span>
    )}
  </div>
  Сообщения
</Link>

          {isLoggedIn ? (
            <div className="mt-2 space-y-1">
              {nickname ? (
                <Link href={`/profile/${nickname}`} className="flex items-center gap-2 px-4 py-3 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {nickname[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{nickname}</p>
                    <p className="text-xs text-gray-500">Профиль</p>
                  </div>
                </Link>
              ) : (
                <Link href="/profile/setup" className="flex items-center gap-2 px-4 py-3 bg-orange-500/20 hover:bg-orange-500/30 rounded-xl transition-colors">
                  <div className="w-8 h-8 bg-orange-500/30 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-orange-400">?</div>
                  <div>
                    <p className="text-sm font-semibold text-orange-400">Привязать Faceit</p>
                    <p className="text-xs text-gray-500">Нажми чтобы настроить</p>
                  </div>
                </Link>
              )}
              <button
                onClick={async () => {
                  await fetch('/api/auth/logout', { method: 'POST' })
                  localStorage.removeItem('currentNickname')
                  window.location.href = '/'
                }}
                className="w-full px-4 py-2 text-xs text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-left"
              >
                Выйти из аккаунта
              </button>
            </div>
          ) : (
            <div className="mt-2 space-y-2">
              <Link href="/auth/login" className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 rounded-xl text-sm font-semibold transition-all">
                Войти в аккаунт
              </Link>
              <Link href="/auth/signup" className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-800 rounded-xl text-sm text-gray-400 transition-all">
                Зарегистрироваться
              </Link>
            </div>
          )}
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 max-w-4xl">
        <ActiveComponent />
      </main>
    </div>
  )
}
