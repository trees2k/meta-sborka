'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { UserPlus, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const { signup, loading: authLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    if (!email || !password || !confirmPassword) {
      setError('Заполните все поля')
      return false
    }
    if (password.length < 6) {
      setError('Пароль должен быть не менее 6 символов')
      return false
    }
    if (password !== confirmPassword) {
      setError('Пароли не совпадают')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setError('')

  if (!validateForm()) return

  setLoading(true)

  try {
    await signup(email, password)
    // Проверяем никнейм напрямую через API
    const meRes = await fetch('/api/auth/me', { credentials: 'include' })
    const meData = await meRes.json()
    if (meData.user?.faceit_nickname) {
      localStorage.setItem('currentNickname', meData.user.faceit_nickname)
      router.push('/')
    } else {
      router.push('/profile/setup')
    }
    router.refresh()
  } catch (err: any) {
    setError(err.message || 'Ошибка при регистрации')
  } finally {
    setLoading(false)
  }
}

  if (authLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-400" />
          <p className="text-gray-400">Загрузка...</p>
        </div>
      </main>
    )
  }

  if (success) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white p-6 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 space-y-6">
            <div className="flex justify-center">
              <CheckCircle2 className="w-16 h-16 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Регистрация успешна!</h2>
              <p className="text-gray-400 text-sm">
                Ваш аккаунт создан. Сейчас вас перенаправит на главную страницу...
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-gray-500">Если перенаправление не произойдёт,</p>
              <Link href="/" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                нажмите здесь
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white p-6">
      <div className="max-w-md mx-auto pt-20">
        {/* Логотип */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            UFUTURE
          </h1>
          <p className="text-gray-400 text-sm">Киберспортивная платформа</p>
        </div>

        {/* Форма регистрации */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Создать аккаунт</h2>
            <p className="text-gray-400 text-sm">Присоединитесь к нашему сообществу</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Минимум 6 символов"
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Подтвердить пароль</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Повторите пароль"
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Регистрация...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Зарегистрироваться
                </>
              )}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800/50 text-gray-400">или</span>
            </div>
          </div>

          <p className="text-center text-gray-400 text-sm">
            Уже есть аккаунт?{' '}
            <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Войти
            </Link>
          </p>
        </div>

        {/* Обратная ссылка */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-gray-400 hover:text-gray-300 text-sm transition-colors flex items-center justify-center gap-2">
            ← Вернуться на главную
          </Link>
        </div>
      </div>
    </main>
  )
}
