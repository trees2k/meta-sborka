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
  const [faceitData, setFaceitData] = useState<any>(null)
  const [pageLoading, setPageLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data.user?.faceit_nickname) {
          setCurrentNickname(data.user.faceit_nickname)
          setNickname(data.user.faceit_nickname)
        }
      })
      .finally(() => setPageLoading(false))
  }, [])

  const checkNickname = async () => {
    if (!nickname.trim()) return
    setChecking(true)
    setError('')
    setFaceitData(null)
    try {
      const res = await fetch(`/api/faceit?nickname=${encodeURIComponent(nickname)}`)
      const data = await res.json()
      if (data.error) {
        setError('Игрок не найден на Faceit. Проверь никнейм.')
      } else {
        setFaceitData(data)
      }
    } catch {
      setError('Ошибка проверки. Попробуй ещё раз.')
    } finally {
      setChecking(false)
    }
  }

  const handleSubmit = async () => {
    if (!faceitData) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faceit_nickname: nickname })
      })
      if (res.ok) {
        // Сохраняем в localStorage
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

        {/* Назад */}
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
          <ArrowLeft size={16} /> На главную
        </Link>

        {/* Заголовок */}
        <div>
          <h1 className="text-3xl font-black">
            {currentNickname ? 'Изменить Faceit' : 'Привязать Faceit'}
          </h1>
          <p className="text-gray-400 mt-1">
            {currentNickname
              ? `Текущий никнейм: ${currentNickname}`
              : 'Привяжи аккаунт Faceit к профилю'}
          </p>
        </div>

        {/* Защита */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-start gap-3">
          <Shield size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-300">Верификация никнейма</p>
            <p className="text-xs text-gray-400 mt-1">
              Мы проверим что такой игрок существует на Faceit. Никнейм нельзя будет менять чаще раза в 30 дней.
            </p>
          </div>
        </div>

        {/* Поле ввода */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={nickname}
              onChange={e => { setNickname(e.target.value); setFaceitData(null); setError('') }}
              onKeyDown={e => e.key === 'Enter' && checkNickname()}
              placeholder="Твой никнейм на Faceit"
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button
              onClick={checkNickname}
              disabled={checking || !nickname.trim()}
              className="px-5 py-3 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded-xl text-sm font-semibold transition-colors"
            >
              {checking ? <Loader size={16} className="animate-spin" /> : 'Проверить'}
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Превью Faceit профиля */}
        {faceitData && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle size={18} className="text-emerald-400 flex-shrink-0" />
              <p className="font-semibold text-emerald-300">Игрок найден!</p>
            </div>
            <div className="flex items-center gap-4">
              <img
                src={faceitData.avatar}
                className="w-14 h-14 rounded-xl object-cover border-2 border-emerald-500/30"
                onError={e => { e.currentTarget.style.display = 'none' }}
              />
              <div>
                <p className="font-black text-lg">{faceitData.nickname}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs font-bold rounded-full">
                    ELO {faceitData.elo}
                  </span>
                  <span className="px-2 py-0.5 bg-gray-700 text-gray-400 text-xs rounded-full">
                    Уровень {faceitData.level}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              {[
                { label: 'Матчей', value: faceitData.stats?.lifetime?.['Matches'] || '—' },
                { label: 'Винрейт', value: `${faceitData.stats?.lifetime?.['Win Rate %'] || '—'}%` },
                { label: 'K/D', value: faceitData.stats?.lifetime?.['Average K/D Ratio'] || '—' },
              ].map((s, i) => (
                <div key={i} className="bg-gray-900/50 rounded-xl p-2">
                  <p className="font-bold text-white">{s.value}</p>
                  <p className="text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Это ты? */}
            <div className="mt-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
              <p className="text-xs text-yellow-400 font-semibold mb-1">⚠️ Это твой аккаунт?</p>
              <p className="text-xs text-gray-400">
                Убедись что это именно твой профиль на Faceit. После сохранения никнейм будет привязан к твоему аккаунту.
              </p>
              <a
                href={`https://www.faceit.com/en/players/${faceitData.nickname}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-2 transition-colors"
              >
                Открыть профиль на Faceit <ExternalLink size={10} />
              </a>
            </div>
          </div>
        )}

        {/* Кнопка сохранить */}
        {faceitData && (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 disabled:opacity-50 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader size={18} className="animate-spin" /> Сохраняем...</>
            ) : (
              <>Привязать аккаунт ✓</>
            )}
          </button>
        )}

      </div>
    </div>
  )
}
