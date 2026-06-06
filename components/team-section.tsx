'use client'

import { useState, useEffect } from 'react'
import { Users, Shield, MessageCircle, Target, Trophy, CheckCircle, ChevronRight, Loader } from 'lucide-react'

const roles = [
  { value: 'entry', label: 'Entry Fragger', desc: 'Врываюсь первым', icon: '💥' },
  { value: 'support', label: 'Support', desc: 'Помогаю команде', icon: '🛡️' },
  { value: 'awp', label: 'AWPer', desc: 'Снайпер команды', icon: '🎯' },
  { value: 'lurker', label: 'Lurker', desc: 'Играю с фланга', icon: '👻' },
  { value: 'igl', label: 'In-Game Leader', desc: 'Раздаю тактику', icon: '📋' },
]

const styles = [
  { value: 'callout', label: 'Только call-out\'ы', icon: '📡' },
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
  const totalSteps = 4

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data.user?.faceit_nickname) {
          setNickname(data.user.faceit_nickname)
        }
      })
      .catch(() => {})
  }, [])

  const handleSubmit = async () => {
    if (!role || !style || !psychotype || !goal) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, role, style, psychotype, goal })
      })
      if (res.ok) setStep('success')
      else setError('Ошибка отправки. Попробуй ещё раз.')
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

  // ─── Интро ───
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
            { icon: MessageCircle, label: 'По общению', desc: 'Тихий, болтливый, call-out\'ы', color: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/10' },
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
              { n: '2', text: 'Мы подбираем игроков с похожими параметрами' },
              { n: '3', text: 'Получаешь список тиммейтов и пишешь им' },
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

  // ─── Успех ───
  if (step === 'success') {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-black">Подбор команды</h2>
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-10 text-center">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-emerald-400" />
          </div>
          <h3 className="text-2xl font-black mb-2">Анкета отправлена!</h3>
          <p className="text-gray-400 mb-6">Когда наберётся достаточно игроков — мы подберём тебе команду и уведомим в Telegram</p>
          <div className="bg-gray-800/50 rounded-xl p-4 text-sm text-gray-400 text-left space-y-2 max-w-sm mx-auto">
            <p><span className="text-white font-semibold">Роль:</span> {roles.find(r => r.value === role)?.label}</p>
            <p><span className="text-white font-semibold">Общение:</span> {styles.find(s => s.value === style)?.label}</p>
            <p><span className="text-white font-semibold">Психотип:</span> {psychotypes.find(p => p.value === psychotype)?.label}</p>
            <p><span className="text-white font-semibold">Цель:</span> {goals.find(g => g.value === goal)?.label}</p>
          </div>
          <button
            onClick={() => { setStep('intro'); setRole(''); setStyle(''); setPsychotype(''); setGoal(''); setFormStep(1) }}
            className="mt-6 px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl text-sm font-medium transition-colors"
          >
            Изменить анкету
          </button>
        </div>
      </div>
    )
  }

  // ─── Форма ───
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => formStep === 1 ? setStep('intro') : setFormStep(formStep - 1)} className="text-gray-500 hover:text-white text-sm transition-colors">
          ← Назад
        </button>
        <h2 className="text-2xl font-black">Анкета игрока</h2>
      </div>

      {/* Прогресс */}
      <div className="flex gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1.5 rounded-full transition-all ${
              i + 1 <= formStep ? 'bg-green-500' : 'bg-gray-700'
            }`}
          />
        ))}
      </div>

      {/* Никнейм */}
      {nickname && (
        <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
          <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
          <p className="text-sm text-gray-300">Анкета для: <strong className="text-white">{nickname}</strong></p>
        </div>
      )}

      {/* Шаг 1 — Роль */}
      {formStep === 1 && (
        <div className="space-y-3">
          <div>
            <p className="font-bold text-lg mb-1">Твоя основная роль</p>
            <p className="text-sm text-gray-400">Что ты делаешь в команде чаще всего?</p>
          </div>
          {roles.map(r => (
            <OptionCard
              key={r.value}
              selected={role === r.value}
              onClick={() => setRole(r.value)}
              icon={r.icon}
              label={r.label}
              desc={r.desc}
            />
          ))}
        </div>
      )}

      {/* Шаг 2 — Стиль общения */}
      {formStep === 2 && (
        <div className="space-y-3">
          <div>
            <p className="font-bold text-lg mb-1">Стиль общения в войсе</p>
            <p className="text-sm text-gray-400">Как ты общаешься с командой во время игры?</p>
          </div>
          {styles.map(s => (
            <OptionCard
              key={s.value}
              selected={style === s.value}
              onClick={() => setStyle(s.value)}
              icon={s.icon}
              label={s.label}
            />
          ))}
        </div>
      )}

      {/* Шаг 3 — Психотип */}
      {formStep === 3 && (
        <div className="space-y-3">
          <div>
            <p className="font-bold text-lg mb-1">Реакция на тильт</p>
            <p className="text-sm text-gray-400">Что происходит когда идёт серия поражений?</p>
          </div>
          {psychotypes.map(p => (
            <OptionCard
              key={p.value}
              selected={psychotype === p.value}
              onClick={() => setPsychotype(p.value)}
              icon={p.icon}
              label={p.label}
            />
          ))}
        </div>
      )}

      {/* Шаг 4 — Цель */}
      {formStep === 4 && (
        <div className="space-y-3">
          <div>
            <p className="font-bold text-lg mb-1">Главная цель в игре</p>
            <p className="text-sm text-gray-400">Зачем ты играешь в CS2?</p>
          </div>
          {goals.map(g => (
            <OptionCard
              key={g.value}
              selected={goal === g.value}
              onClick={() => setGoal(g.value)}
              icon={g.icon}
              label={g.label}
            />
          ))}
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
          <><Loader size={18} className="animate-spin" /> Отправляем...</>
        ) : formStep < totalSteps ? (
          <>Далее <ChevronRight size={18} /></>
        ) : (
          <>Отправить анкету ✓</>
        )}
      </button>

      <p className="text-center text-xs text-gray-600">
        Шаг {formStep} из {totalSteps}
      </p>
    </div>
  )
}
