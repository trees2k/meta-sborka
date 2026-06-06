'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Users, Shield, MessageCircle, Target, CheckCircle, ChevronRight, Loader } from 'lucide-react'

const roles = [
  { value: 'entry', label: 'Entry Fragger', desc: 'Врываюсь первым', icon: '💥' },
  { value: 'support', label: 'Support', desc: 'Помогаю команде', icon: '🛡️' },
  { value: 'awp', label: 'AWPer', desc: 'Снайпер команды', icon: '🎯' },
  { value: 'lurker', label: 'Lurker', desc: 'Играю с фланга', icon: '👻' },
  { value: 'igl', label: 'In-Game Leader', desc: 'Раздаю тактику', icon: '📋' },
]

const styles = [
  { value: 'callout', label: "Только call-out'ы", icon: '📡' },
  { value: 'talkative', label: 'Люблю поговорить', icon: '🗣️' },
  { value: 'silent', label: 'Абсолютная тишина', icon: '🔇' },
]

const psychotypes = [
  { value: 'calm', label: 'Сохраняю спокойствие', icon: '😌' },
  { value: 'emotional', label: 'Эмоциональный, но отхожу', icon: '😤' },
  { value: 'explosive', label: 'Лучше не трогать', icon: '🌋' },
]

const goals = [
  { value: 'win', label: 'Победа любой ценой', icon: '🏆' },
  { value: 'stats', label: 'Апнуть личную стату', icon: '📈' },
  { value: 'fun', label: 'Просто кайфануть', icon: '😎' },
]

function OptionCard({ selected, onClick, icon, label, desc }: {
  selected: boolean
  onClick: () => void
  icon: string
  label: string
  desc?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all border ${
        selected
          ? 'bg-blue-500/20 border-blue-500/50 text-white'
          : 'bg-gray-900/50 border-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-800/50'
      }`}
    >
      <span className="text-xl flex-shrink-0">{icon}</span>
      <div className="flex-1">
        <p className="font-medium text-sm">{label}</p>
        {desc && <p className="text-xs text-gray-500">{desc}</p>}
      </div>
      {selected && <CheckCircle size={16} className="text-blue-400 flex-shrink-0" />}
    </button>
  )
}

export function TeamSection() {
  const [step, setStep] = useState<'intro' | 'form' | 'success'>('intro')
  const [nickname, setNickname] = useState('')
  const [role, setRole] = useState('')
  const [style, setStyle] = useState('')
  const [psychotype, setPsychotype] = useState('')
  const [goal, setGoal] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formStep, setFormStep] = useState(1)
  const [matches, setMatches] = useState<any[]>([])
  const totalSteps = 4

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data.user?.faceit_nickname) setNickname(data.user.faceit_nickname)
      })
      .catch(() => {})
  }, [])

  const handleSubmit = async () => {
    if (!role || !style || !psychotype || !goal) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, style, psychotype, goal })
      })
      const data = await res.json()
      if (res.ok) {
        setMatches(data.matches || [])
        setStep('success')
      } else {
        setError(data.error || 'Ошибка отправки')
      }
    } catch {
      setError('Ошибка сети')
    } finally {
      setLoading(false)
    }
  }

  const canNext = () => {
    if (formStep === 1) return !!role
    if (formStep === 2) return !!style
    if (formStep === 3) return !!psychotype
    if (formStep === 4) return !!goal
    return false
  }

  const reset = () => {
    setStep('intro')
    setRole('')
    setStyle('')
    setPsychotype('')
    setGoal('')
    setFormStep(1)
    setMatches([])
  }

  if (step === 'intro') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-black">Подбор команды</h2>
          <p className="text-gray-400 mt-1">Найди тиммейтов под свой стиль игры</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Target, label: 'По ролям', desc: 'Entry, AWP, Support, IGL, Lurker', color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10' },
            { icon: MessageCircle, label: 'По общению', desc: "Тихий, болтливый, call-out'ы", color: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/10' },
            { icon: Shield, label: 'По психотипу', desc: 'Реакция на тильт и поражения', color: 'from-green-500 to-emerald-500', bg: 'bg-green-500/10' },
          ].map((item, i) => (
            <div key={i} className={`${item.bg} rounded-2xl p-5`}>
              <div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-3`}>
                <item.icon size={18} className="text-white" />
              </div>
              <p className="font-bold text-sm">{item.label}</p>
              <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users size={20} className="text-green-400" />
            <p className="font-bold">Как это работает</p>
          </div>
          <div className="space-y-3">
            {[
              { n: '1', text: 'Заполняешь анкету — роль, стиль, психотип, цель' },
              { n: '2', text: 'Алгоритм подбирает игроков с похожим ELO и совместимым стилем' },
              { n: '3', text: 'Получаешь список тиммейтов и пишешь им напрямую' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                <span className="w-6 h-6 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {item.n}
                </span>
                {item.text}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setStep('form')}
          className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2"
        >
          Заполнить анкету <ChevronRight size={20} />
        </button>
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-black">Подбор команды</h2>

        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <CheckCircle size={20} className="text-emerald-400" />
            </div>
            <div>
              <p className="font-black text-lg">Анкета отправлена!</p>
              <p className="text-gray-400 text-sm">Твои данные сохранены в базе</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {[
              { label: 'Роль', value: roles.find(r => r.value === role)?.label, icon: roles.find(r => r.value === role)?.icon },
              { label: 'Общение', value: styles.find(s => s.value === style)?.label, icon: styles.find(s => s.value === style)?.icon },
              { label: 'Психотип', value: psychotypes.find(p => p.value === psychotype)?.label, icon: psychotypes.find(p => p.value === psychotype)?.icon },
              { label: 'Цель', value: goals.find(g => g.value === goal)?.label, icon: goals.find(g => g.value === goal)?.icon },
            ].map((item, i) => (
              <div key={i} className="bg-gray-900/50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                <p className="font-semibold text-white text-xs">{item.icon} {item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Users size={18} className="text-blue-400" />
            {matches.length > 0 ? `Найдено тиммейтов: ${matches.length}` : 'Тиммейты не найдены'}
          </h3>

          {matches.length > 0 ? (
            <div className="space-y-3">
              {matches.map((m, i) => {
                const matchRole = roles.find(r => r.value === m.role)
                const matchStyle = styles.find(s => s.value === m.style)
                const matchGoal = goals.find(g => g.value === m.goal)
                const compatibility = Math.min(100, Math.round((m.score / 100) * 100))

                return (
                  <div key={i} className="bg-gray-800/50 rounded-2xl p-4 hover:bg-gray-800/80 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0">
                          {m.nickname[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold">{m.nickname}</p>
                          <p className="text-xs text-gray-500">ELO {m.faceit_elo}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">Совместимость</p>
                        <p className={`text-sm font-black ${compatibility >= 70 ? 'text-emerald-400' : compatibility >= 40 ? 'text-yellow-400' : 'text-gray-400'}`}>
                          {compatibility}%
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {matchRole && <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-lg">{matchRole.icon} {matchRole.label}</span>}
                      {matchStyle && <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-lg">{matchStyle.icon} {matchStyle.label}</span>}
                      {matchGoal && <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-lg">{matchGoal.icon} {matchGoal.label}</span>}
                    </div>

                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden mb-3">
                      <div
                        className={`h-full rounded-full ${compatibility >= 70 ? 'bg-emerald-500' : compatibility >= 40 ? 'bg-yellow-500' : 'bg-gray-500'}`}
                        style={{ width: `${compatibility}%` }}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/profile/${m.nickname}`} className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl text-xs font-semibold text-center transition-colors">
                        Профиль
                      </Link>
                      <Link href={`/messages/${m.nickname}`} className="flex-1 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl text-xs font-semibold text-center transition-colors">
                        Написать
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-gray-800/50 rounded-2xl p-8 text-center">
              <Users size={40} className="text-gray-700 mx-auto mb-3" />
              <p className="text-gray-400 font-semibold mb-1">Пока нет подходящих игроков</p>
              <p className="text-gray-500 text-sm">Мы уведомим тебя когда появятся тиммейты с похожим стилем</p>
            </div>
          )}
        </div>

        <button onClick={reset} className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-sm font-medium transition-colors">
          Изменить анкету
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => formStep === 1 ? setStep('intro') : setFormStep(formStep - 1)} className="text-gray-500 hover:text-white text-sm transition-colors">
          ← Назад
        </button>
        <h2 className="text-2xl font-black">Анкета игрока</h2>
      </div>

      <div className="flex gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${i + 1 <= formStep ? 'bg-green-500' : 'bg-gray-700'}`} />
        ))}
      </div>

      {nickname && (
        <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
          <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
          <p className="text-sm text-gray-300">Анкета для: <strong className="text-white">{nickname}</strong></p>
        </div>
      )}

      {formStep === 1 && (
        <div className="space-y-3">
          <div>
            <p className="font-bold text-lg mb-1">Твоя основная роль</p>
            <p className="text-sm text-gray-400">Что ты делаешь в команде чаще всего?</p>
          </div>
          {roles.map(r => <OptionCard key={r.value} selected={role === r.value} onClick={() => setRole(r.value)} icon={r.icon} label={r.label} desc={r.desc} />)}
        </div>
      )}

      {formStep === 2 && (
        <div className="space-y-3">
          <div>
            <p className="font-bold text-lg mb-1">Стиль общения в войсе</p>
            <p className="text-sm text-gray-400">Как ты общаешься с командой во время игры?</p>
          </div>
          {styles.map(s => <OptionCard key={s.value} selected={style === s.value} onClick={() => setStyle(s.value)} icon={s.icon} label={s.label} />)}
        </div>
      )}

      {formStep === 3 && (
        <div className="space-y-3">
          <div>
            <p className="font-bold text-lg mb-1">Реакция на тильт</p>
            <p className="text-sm text-gray-400">Что происходит когда идёт серия поражений?</p>
          </div>
          {psychotypes.map(p => <OptionCard key={p.value} selected={psychotype === p.value} onClick={() => setPsychotype(p.value)} icon={p.icon} label={p.label} />)}
        </div>
      )}

      {formStep === 4 && (
        <div className="space-y-3">
          <div>
            <p className="font-bold text-lg mb-1">Главная цель в игре</p>
            <p className="text-sm text-gray-400">Зачем ты играешь в CS2?</p>
          </div>
          {goals.map(g => <OptionCard key={g.value} selected={goal === g.value} onClick={() => setGoal(g.value)} icon={g.icon} label={g.label} />)}
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm">
          ⚠️ {error}
        </div>
      )}

      <button
        onClick={() => formStep < totalSteps ? setFormStep(formStep + 1) : handleSubmit()}
        disabled={!canNext() || loading}
        className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 disabled:opacity-40 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
      >
        {loading ? (
          <><Loader size={18} className="animate-spin" /> Подбираем игроков...</>
        ) : formStep < totalSteps ? (
          <>Далее <ChevronRight size={18} /></>
        ) : (
          <>Найти тиммейтов ✓</>
        )}
      </button>

      <p className="text-center text-xs text-gray-600">Шаг {formStep} из {totalSteps}</p>
    </div>
  )
}
