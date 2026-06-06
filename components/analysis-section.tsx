'use client'

import { useState } from 'react'
import {
  Swords, Zap, Upload,
  CheckCircle, Circle, ExternalLink, ChevronDown,
  AlertCircle, Play, BarChart3
} from 'lucide-react'

function FaceitDemoFinder({ onAnalysis, onLoading, onError, onFileReady }: {
  onAnalysis: (a: any) => void
  onLoading: (l: boolean) => void
  onError: (e: string | null) => void
  onFileReady: (file: File) => void
}) {
  const [nickname, setNickname] = useState('')
  const [matches, setMatches] = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState<any>(null)
  const [step, setStep] = useState<1 | 2 | 3>(1)

  const findMatches = async () => {
    if (!nickname.trim()) return
    setSearching(true)
    onError(null)
    try {
      const res = await fetch(`/api/faceit?nickname=${encodeURIComponent(nickname)}`, { method: 'PATCH' })
      const data = await res.json()
      if (data.matches) {
        setMatches(data.matches)
        setStep(2)
      } else {
        onError(data.error || 'Игрок не найден')
      }
    } catch {
      onError('Ошибка поиска')
    } finally {
      setSearching(false)
    }
  }

  const selectMatch = (match: any) => {
    setSelectedMatch(match)
    setStep(3)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files?.[0]
    if (file) onFileReady(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFileReady(file)
  }

  return (
    <div className="space-y-4">
      {/* Шаг 1 */}
      <div className={`rounded-2xl overflow-hidden border transition-all ${step >= 1 ? 'border-orange-500/30 bg-orange-500/5' : 'border-gray-700/50 bg-gray-800/30'}`}>
        <div className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${step > 1 ? 'bg-emerald-500 text-white' : 'bg-orange-500 text-white'}`}>
              {step > 1 ? '✓' : '1'}
            </div>
            <div>
              <p className="font-bold text-sm">Найди свои матчи на Faceit</p>
              <p className="text-xs text-gray-400">Введи никнейм — покажем последние 5 матчей</p>
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && findMatches()}
              placeholder="Твой Faceit никнейм"
              className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors"
            />
            <button
              onClick={findMatches}
              disabled={searching || !nickname.trim()}
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 rounded-xl text-sm font-semibold transition-all"
            >
              {searching ? '...' : 'Найти'}
            </button>
          </div>
          {matches.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-xs text-gray-400 font-semibold mb-2">Выбери матч для разбора:</p>
              {matches.map((m: any) => (
                <button
                  key={m.match_id}
                  onClick={() => selectMatch(m)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all ${
                    selectedMatch?.match_id === m.match_id
                      ? 'bg-orange-500/20 border border-orange-500/40'
                      : 'bg-gray-900/50 hover:bg-gray-800 border border-transparent'
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium">
                      {m.played_at
                        ? new Date(String(m.played_at).length === 10 ? m.played_at * 1000 : m.played_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
                        : `Матч ...${m.match_id.slice(-6)}`}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {m.demo_url ? '✅ Демка доступна' : '❌ Демка недоступна'}
                    </p>
                  </div>
                  {selectedMatch?.match_id === m.match_id
                    ? <CheckCircle size={18} className="text-orange-400 flex-shrink-0" />
                    : <Circle size={18} className="text-gray-600 flex-shrink-0" />
                  }
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Шаг 2 */}
      {selectedMatch && (
        <div className="rounded-2xl overflow-hidden border border-blue-500/30 bg-blue-500/5 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
              2
            </div>
            <div>
              <p className="font-bold text-sm">Скачай демку с Faceit</p>
              <p className="text-xs text-gray-400">Откроется страница матча — нажми кнопку скачать</p>
            </div>
          </div>
          <div className="bg-gray-900/60 rounded-xl p-4 mb-4 space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Инструкция:</p>
            {[
              { step: 'Нажми кнопку ниже — откроется страница матча на Faceit', icon: '🔗' },
              { step: 'На странице матча найди кнопку "Download Demo" (справа вверху)', icon: '⬇️' },
              { step: 'Файл скачается в папку Загрузки — найди его там (не перетаскивай прямо с сайта Faceit!)', icon: '📁' },
              { step: 'Перетащи файл .dem.zst из папки Загрузки на Рабочий стол', icon: '🖥️' },
              { step: 'Вернись сюда, в шаге 3 нажми "Выбрать файл" или перетащи с Рабочего стола', icon: '⬆️' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                <span className="text-base flex-shrink-0">{item.icon}</span>
                <span>{item.step}</span>
              </div>
            ))}
          </div>
          <a
            href={`https://www.faceit.com/en/cs2/room/${selectedMatch.match_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90 rounded-xl font-semibold text-sm transition-all"
          >
            <ExternalLink size={16} />
            Открыть матч на Faceit
          </a>
        </div>
      )}

      {/* Шаг 3 */}
      {selectedMatch && (
        <div className="rounded-2xl overflow-hidden border border-emerald-500/30 bg-emerald-500/5 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
              3
            </div>
            <div>
              <p className="font-bold text-sm">Загрузи скачанный файл</p>
              <p className="text-xs text-gray-400">Перетащи файл с Рабочего стола или нажми "Выбрать файл"</p>
            </div>
          </div>
          <div
            className="border-2 border-dashed border-emerald-500/40 hover:border-emerald-500/70 rounded-xl p-6 text-center cursor-pointer transition-all group"
            onDragOver={e => { e.preventDefault(); e.stopPropagation() }}
            onDrop={handleDrop}
            onClick={() => document.getElementById('demo-file-faceit')?.click()}
          >
            <input
              id="demo-file-faceit"
              type="file"
              accept=".dem,.zst"
              className="hidden"
              onChange={handleFileInput}
            />
            <Upload size={32} className="text-emerald-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="font-semibold text-sm">Перетащи файл с Рабочего стола сюда</p>
            <p className="text-xs text-gray-500 mt-1">или нажми чтобы выбрать · .dem или .dem.zst · до 500 МБ</p>
          </div>
        </div>
      )}
    </div>
  )
}

export function AnalysisSection() {
  const [tab, setTab] = useState<'overview' | 'rounds' | 'errors' | 'map'>('overview')
  const [openErr, setOpenErr] = useState<number | null>(0)
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [method, setMethod] = useState<'faceit' | 'manual' | null>(null)

  const tabs = [
    { id: 'overview', label: 'Обзор' },
    { id: 'rounds', label: 'По раундам' },
    { id: 'errors', label: 'Ошибки' },
    { id: 'map', label: 'Карта' },
  ] as const

  const handleFile = async (file: File) => {
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

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const stats = analysis ? [
    { label: 'K/D', you: String(analysis.stats.kd), pro: '1.2', youW: Math.min(analysis.stats.kd * 25, 100), proW: 55, good: analysis.stats.kd >= 1.2 },
    { label: 'ADR', you: String(analysis.stats.adr), pro: '85', youW: Math.min(analysis.stats.adr, 100), proW: 60, good: analysis.stats.adr >= 85 },
    { label: 'HS%', you: `${analysis.stats.hs}%`, pro: '50%', youW: analysis.stats.hs, proW: 50, good: analysis.stats.hs >= 50 },
    { label: 'Утилита', you: String(analysis.stats.utility_damage), pro: '40+', youW: Math.min(analysis.stats.utility_damage * 2, 100), proW: 40, good: analysis.stats.utility_damage >= 30 },
    { label: 'KAST', you: `${analysis.stats.kast}%`, pro: '73%', youW: analysis.stats.kast, proW: 73, good: analysis.stats.kast >= 73 },
  ] : []

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-black">Разбор ошибок</h2>
        <div className="bg-gray-800/50 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-6" />
          <h3 className="text-xl font-bold mb-2">Анализируем демку...</h3>
          <p className="text-gray-400 text-sm">Может занять 2-5 минут</p>
          <div className="mt-6 space-y-2 text-sm text-gray-500">
            <p>⚙️ Парсинг событий матча</p>
            <p>🗺️ Обработка позиций на карте</p>
            <p>🧠 Анализ ошибок</p>
            <p>🎬 Нарезка хайлайтов</p>
          </div>
        </div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-black">Разбор ошибок</h2>
          <p className="text-gray-400 mt-1">Загрузи демку и получи детальный анализ + хайлайты</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: BarChart3, label: 'Статистика', desc: 'K/D, ADR, KAST, HS%', color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { icon: AlertCircle, label: 'Ошибки', desc: 'Список с советами', color: 'text-red-400', bg: 'bg-red-500/10' },
            { icon: Play, label: 'Раунды', desc: 'Разбор каждого', color: 'text-purple-400', bg: 'bg-purple-500/10' },
            { icon: Swords, label: 'Хайлайты', desc: 'Авто-нарезка', color: 'text-orange-400', bg: 'bg-orange-500/10' },
          ].map((item, i) => (
            <div key={i} className={`${item.bg} rounded-2xl p-4 text-center`}>
              <item.icon size={24} className={`${item.color} mx-auto mb-2`} />
              <p className="font-bold text-sm">{item.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>

        {!method && (
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => setMethod('faceit')}
              className="bg-gray-800/50 hover:bg-gray-800/80 border border-gray-700/50 hover:border-orange-500/40 rounded-2xl p-6 text-left transition-all group"
            >
              <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center mb-3">
                <Zap size={20} className="text-orange-400" />
              </div>
              <h3 className="font-bold mb-1">Faceit матч</h3>
              <p className="text-sm text-gray-400">Найди матч по никнейму и скачай демку с Faceit</p>
              <div className="flex items-center gap-1 mt-3 text-orange-400 text-sm font-medium">
                Выбрать <ChevronDown size={14} className="rotate-[-90deg]" />
              </div>
            </button>

            <button
              onClick={() => setMethod('manual')}
              className="bg-gray-800/50 hover:bg-gray-800/80 border border-gray-700/50 hover:border-emerald-500/40 rounded-2xl p-6 text-left transition-all group"
            >
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-3">
                <Upload size={20} className="text-emerald-400" />
              </div>
              <h3 className="font-bold mb-1">Загрузить файл</h3>
              <p className="text-sm text-gray-400">Уже есть .dem файл? Загрузи напрямую</p>
              <div className="flex items-center gap-1 mt-3 text-emerald-400 text-sm font-medium">
                Выбрать <ChevronDown size={14} className="rotate-[-90deg]" />
              </div>
            </button>
          </div>
        )}

        {method === 'faceit' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setMethod(null)} className="text-gray-500 hover:text-white text-sm transition-colors">← Назад</button>
              <h3 className="font-bold">Загрузка с Faceit</h3>
            </div>
            <FaceitDemoFinder
              onAnalysis={setAnalysis}
              onLoading={setLoading}
              onError={setError}
              onFileReady={handleFile}
            />
          </div>
        )}

        {method === 'manual' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setMethod(null)} className="text-gray-500 hover:text-white text-sm transition-colors">← Назад</button>
              <h3 className="font-bold">Загрузка файла</h3>
            </div>
            <div className="bg-gray-800/50 rounded-2xl p-5 space-y-3">
              <p className="text-sm font-semibold text-gray-400">Где найти .dem файл:</p>
              <div className="space-y-2">
                {[
                  { platform: 'Faceit', steps: 'faceit.com → Match Room → Download Demo → файл в папке Загрузки', icon: '🟠' },
                  { platform: 'CS2 Premier', steps: 'CS2 → Смотреть → Скачать демо → файл в папке с игрой', icon: '🔵' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-gray-900/50 rounded-xl p-3">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <p className="text-sm font-semibold">{item.platform}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.steps}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
                <p className="text-xs text-yellow-400">⚠️ Не перетаскивай файл прямо с сайта Faceit — он скачается заново. Сначала скачай в папку Загрузки, потом перетащи отсюда на сайт.</p>
              </div>
            </div>

            <div
              className="bg-gray-800/50 border-2 border-dashed border-gray-600 hover:border-red-500/50 rounded-2xl p-10 text-center cursor-pointer transition-all group"
              onDragOver={e => { e.preventDefault(); e.stopPropagation() }}
              onDrop={handleDrop}
              onClick={() => document.getElementById('demo-file-manual')?.click()}
            >
              <input
                id="demo-file-manual"
                type="file"
                accept=".dem,.zst"
                className="hidden"
                onChange={handleFileInput}
              />
              <Swords size={48} className="text-red-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2">Перетащи файл с Рабочего стола сюда</h3>
              <p className="text-gray-400 text-sm mb-5">или нажми чтобы выбрать · .dem или .dem.zst · до 500 МБ</p>
              <div className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl font-semibold inline-block text-sm">
                Выбрать файл
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle size={18} className="flex-shrink-0" />
            {error}
          </div>
        )}
      </div>
    )
  }

  const s = analysis.stats
  const errors = analysis.errors || []
  const rounds = analysis.rounds || []
  const deaths = analysis.deaths || []
  const kills = analysis.kills || []

  const calcPos = (pts: any[]) => {
    if (!pts.length) return { minX: 0, maxX: 1, minY: 0, maxY: 1 }
    const allX = pts.map(p => p.x), allY = pts.map(p => p.y)
    return { minX: Math.min(...allX), maxX: Math.max(...allX), minY: Math.min(...allY), maxY: Math.max(...allY) }
  }

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
              {errors.length} ошибок
            </span>
          )}
          <div
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl text-sm cursor-pointer transition-all"
            onClick={() => document.getElementById('demo-file-new')?.click()}
          >
            <input id="demo-file-new" type="file" accept=".dem,.zst" className="hidden" onChange={handleFileInput} />
            Новая демка
          </div>
        </div>
      </div>

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

      {tab === 'overview' && (
        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-2xl p-6">
            <p className="text-sm text-gray-400 mb-4">Твои показатели vs профи (FaceIT Lvl 10)</p>
            <div className="flex gap-4 text-xs text-gray-500 mb-4">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />Ты</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />Про / норма</span>
            </div>
            <div className="space-y-3">
              {stats.map((s, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span className="w-20 text-right text-gray-400 text-xs flex-shrink-0">{s.label}</span>
                  <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${s.good ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${s.youW}%` }} />
                  </div>
                  <span className={`w-14 text-right font-semibold text-xs ${s.good ? 'text-emerald-400' : 'text-red-400'}`}>{s.you}</span>
                  <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-blue-500" style={{ width: `${s.proW}%` }} />
                  </div>
                  <span className="w-10 text-right text-gray-500 text-xs">{s.pro}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5">
              <p className="text-sm text-gray-400 mb-3">Сильные стороны</p>
              {stats.filter(s => s.good).length === 0
                ? <p className="text-sm text-gray-500">Есть над чем поработать</p>
                : stats.filter(s => s.good).map((s, i) => (
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

      {tab === 'map' && (
        <div className="space-y-4">
          <div className="bg-gray-900 rounded-2xl p-4">
            <p className="text-xs text-gray-500 mb-3">{s.map} — {deaths.length} смертей · {kills.length} убийств</p>
            <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: '1' }}>
              <img
                src={`https://totalcsgo.com/images/maps/map-${s.map}.jpg`}
                className="w-full h-full object-cover opacity-40"
                onError={e => (e.currentTarget.style.display = 'none')}
              />
              <svg viewBox="0 0 500 500" className="absolute inset-0 w-full h-full">
                {(() => {
                  const all = [...deaths, ...kills]
                  if (!all.length) return null
                  const { minX, maxX, minY, maxY } = calcPos(all)
                  const rX = maxX - minX || 1
                  const rY = maxY - minY || 1
                  const sx = (x: number) => ((x - minX) / rX) * 420 + 40
                  const sy = (y: number) => ((maxY - y) / rY) * 420 + 40
                  return <>
                    {kills.slice(0, 50).map((k: any, i: number) => (
                      <circle key={`k${i}`} cx={sx(k.x)} cy={sy(k.y)} r="7" fill="#0f6e56" stroke="#1d9e75" strokeWidth="1.5" opacity="0.85" />
                    ))}
                    {deaths.map((d: any, i: number) => (
                      <circle key={`d${i}`} cx={sx(d.x)} cy={sy(d.y)} r="10" fill="#7f1515" stroke="#e24b4a" strokeWidth="2" opacity="0.9" />
                    ))}
                  </>
                })()}
              </svg>
            </div>
          </div>
          <div className="flex gap-4 flex-wrap text-xs text-gray-400">
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500 inline-block" />Смерть ({deaths.length})</span>
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />Убийство ({kills.length})</span>
          </div>
        </div>
      )}
    </div>
  )
}
