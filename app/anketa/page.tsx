'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AnketaPage() {
  const [nickname, setNickname] = useState('')
  const [role, setRole] = useState('')
  const [style, setStyle] = useState('')
  const [psychotype, setPsychotype] = useState('')
  const [goal, setGoal] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickname, role, style, psychotype, goal })
    })
    if (res.ok) setSubmitted(true)
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-gray-950 text-white p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Анкета отправлена!</h1>
        <p className="text-gray-400 mb-6">Когда наберётся 10 игроков, мы соберём команды.</p>
        <Link href="/cabinet" className="text-blue-400 hover:underline">В кабинет</Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-xl mx-auto">
        <Link href="/" className="text-blue-400 hover:underline">← На главную</Link>
        <h1 className="text-3xl font-bold mt-4 mb-6">Анкета игрока</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Никнейм Faceit</label>
            <input value={nickname} onChange={e => setNickname(e.target.value)} required
              className="w-full px-4 py-2 rounded-xl bg-gray-800 border border-gray-700" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Основная роль</label>
            <select value={role} onChange={e => setRole(e.target.value)} required
              className="w-full px-4 py-2 rounded-xl bg-gray-800 border border-gray-700">
              <option value="">Выбери...</option>
              <option value="entry">Entry Fragger</option>
              <option value="support">Support</option>
              <option value="awp">AWPer</option>
              <option value="lurker">Lurker</option>
              <option value="igl">In-Game Leader</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Стиль общения</label>
            <select value={style} onChange={e => setStyle(e.target.value)} required
              className="w-full px-4 py-2 rounded-xl bg-gray-800 border border-gray-700">
              <option value="">Выбери...</option>
              <option value="callout">Только call-out'ы</option>
              <option value="talkative">Много болтаю</option>
              <option value="silent">Абсолютная тишина</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Реакция на тильт</label>
            <select value={psychotype} onChange={e => setPsychotype(e.target.value)} required
              className="w-full px-4 py-2 rounded-xl bg-gray-800 border border-gray-700">
              <option value="">Выбери...</option>
              <option value="calm">Сохраняю спокойствие</option>
              <option value="emotional">Эмоциональный, но отходчивый</option>
              <option value="explosive">Меня лучше не трогать после поражения</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Главная цель</label>
            <select value={goal} onChange={e => setGoal(e.target.value)} required
              className="w-full px-4 py-2 rounded-xl bg-gray-800 border border-gray-700">
              <option value="">Выбери...</option>
              <option value="win">Победа любой ценой</option>
              <option value="stats">Апнуть личную стату</option>
              <option value="fun">Просто кайфануть</option>
            </select>
          </div>
          <button type="submit" className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold">
            Отправить
          </button>
        </form>
      </div>
    </main>
  )
}