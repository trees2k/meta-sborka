'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, AlertCircle, Loader, Shield, ExternalLink, ArrowLeft } from 'lucide-react'

export default function SetupPage() {
  const [nickname, setNickname] = useState('')
  const [currentNickname, setCurrentNickname] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [faceitData, setFaceitData] = useState<any>(null)
  const [steamId, setSteamId] = useState('')
  const [verified, setVerified] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data.user?.faceit_nickname) {
          setCurrentNickname(data.user.faceit_nickname)
          setNickname(data.user.faceit_nickname)
          if (data.user.faceit_verified) setVerified(true)
        }
      })
      .finally(() => setPageLoading(false))
  }, [])

  const checkNickname = async () => {
    if (!nickname.trim()) return
    setChecking(true)
    setError('')
    setFaceitData(null)
    setVerified(false)
    try {
      const res = await fetch(`/api/faceit?nickname=${encodeURIComponent(nickname)}`)
      const data = await res.json()
      if (data.error) {
        setError('Игрок не найден на Faceit. Проверь никнейм.')
      } else {
        setFaceitData(data)
        setStep(2)
      }
    } catch {
      setError('Ошибка проверки. Попробуй ещё раз.')
    } finally {
      setChecking(false)
    }
  }

  const verifyNickname = async () => {
    setVerifying(true)
    setError('')
    try {
      const res = await fetch('/api/profile/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, steamId })
      })
      const data = await res.json()
      if (data.ok) {
        setVerified(true)
        setStep(3)
      } else {
        setError(data.error || 'Steam ID не совпадает')
      }
    } catch {
      setError('Ошибка проверки')
    } finally {
      setVerifying(false)
    }
  }

  const handleSubmit = async () => {
    if (!faceitData || !verified) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faceit_nickname: nickname, faceit_verified: true })
      })
      if (res.ok) {
        localStorage.setItem('currentNickname', nickname)
        router.push(`/profile/${nickname}`)
      } else {
        const data = await res.json()
        setError(data.error || 'Ошибка сохранения')
      }
    } catch {
      setError('Ошибка сети')
    } finally {
      setLoading(false)
    }
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white p-6 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">

        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
          <ArrowLeft size={16} /> На главную
        </Link>

        <div>
          <h1 className="text-3xl font-black">
            {currentNickname ? 'Изменить Faceit' : 'Привязать Faceit'}
          </h1>
          <p className="text-gray-400 mt-1">
            {currentNickname ? `Текущий никнейм: ${currentNickname}` : 'Привяжи и подтверди свой аккаунт Faceit'}
          </p>
        </div>

        {/* Прогресс */}
        <div className="flex gap-2">
          {['Найти аккаунт', 'Подтвердить', 'Готово'].map((label, i) => (
            <div key={i} className="flex-1">
              <div className={`h-1.5 rounded-full mb-1 transition-all ${i + 1 <= step ? 'bg-blue-500' : 'bg-gray-700'}`} />
              <p className={`text-xs text-center ${i + 1 <= step ? 'text-blue-400' : 'text-gray-600'}`}>{label}</p>
            </div>
          ))}
        </div>

        {/* Шаг 1 */}
        <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${step > 1 ? 'bg-emerald-500 text-white' : 'bg-blue-500 text-white'}`}>
              {step > 1 ? '✓' : '1'}
            </div>
            <div>
              <p className="font-bold text-sm">Введи никнейм на Faceit</p>
              <p className="text-xs text-gray-400">Найдём твой профиль и проверим что он существует</p>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={nickname}
              onChange={e => { setNickname(e.target.value); setFaceitData(null); setError(''); setStep(1) }}
              onKeyDown={e => e.key === 'Enter' && checkNickname()}
              placeholder="Твой никнейм на Faceit"
              className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
            />
            <button
              onClick={checkNickname}
              disabled={checking || !nickname.trim()}
              className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 rounded-xl text-sm font-semibold transition-colors"
            >
              {checking ? <Loader size={16} className="animate-spin" /> : 'Найти'}
            </button>
          </div>

          {faceitData && (
            <div className="mt-4 flex items-center gap-3 bg-gray-900/50 rounded-xl p-3">
              <img
                src={faceitData.avatar}
                className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                onError={e => { e.currentTarget.style.display = 'none' }}
              />
              <div className="flex-1">
                <p className="font-bold text-sm">{faceitData.nickname}</p>
                <p className="text-xs text-gray-500">ELO {faceitData.elo} · Уровень {faceitData.level}</p>
              </div>
              <CheckCircle size={18} className="text-emerald-400 flex-shrink-0" />
            </div>
          )}
        </div>

        {/* Шаг 2 — Верификация через Steam */}
        {step >= 2 && (
          <div className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${step > 2 ? 'bg-emerald-500 text-white' : 'bg-orange-500 text-white'}`}>
                {step > 2 ? '✓' : '2'}
              </div>
              <div>
                <p className="font-bold text-sm">Подтверди через Steam ID</p>
                <p className="text-xs text-gray-400">Введи свой Steam ID64 — сравним с Faceit профилем</p>
              </div>
            </div>

            <div className="bg-gray-900/60 rounded-xl p-4 mb-4 space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Как найти Steam ID64:</p>
              {[
                { text: 'Открой Steam → нажми на свой ник вверху → Профиль', icon: '1️⃣' },
                { text: 'В адресной строке скопируй цифры после /profiles/ (17 цифр)', icon: '2️⃣' },
                { text: 'Или зайди на steamid.io и введи свой ник', icon: '3️⃣' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="text-base flex-shrink-0">{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={steamId}
                onChange={e => { setSteamId(e.target.value); setError('') }}
                onKeyDown={e => e.key === 'Enter' && verifyNickname()}
                placeholder="76561198XXXXXXXXX"
                className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors text-sm font-mono"
              />
              <button
                onClick={verifyNickname}
                disabled={verifying || !steamId.trim()}
                className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 rounded-xl text-sm font-semibold transition-colors"
              >
                {verifying ? <Loader size={16} className="animate-spin" /> : 'Проверить'}
              </button>
            </div>

            <a
              href="https://steamid.io"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ExternalLink size={10} /> Найти свой Steam ID на steamid.io
            </a>

            {verified && (
              <div className="mt-3 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
                <p className="text-sm text-emerald-300 font-semibold">Steam ID совпадает — аккаунт подтверждён!</p>
              </div>
            )}
          </div>
        )}

        {/* Шаг 3 */}
        {step >= 3 && verified && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-bold text-sm">Всё готово!</p>
                <p className="text-xs text-gray-400">Сохрани никнейм и перейди в профиль</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-gray-900/50 rounded-xl p-3 mb-4">
              <Shield size={16} className="text-emerald-400 flex-shrink-0" />
              <p className="text-xs text-gray-300">
                Никнейм <strong className="text-white">{nickname}</strong> верифицирован и привязан к твоему аккаунту
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 disabled:opacity-50 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader size={18} className="animate-spin" /> Сохраняем...</>
              ) : (
                <>Сохранить и перейти в профиль ✓</>
              )}
            </button>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm">
            <AlertCircle size={16} className="flex-shrink-0" />
            {error}
          </div>
        )}

      </div>
    </div>
  )
}
