'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else window.location.href = '/cabinet'
    setLoading(false)
  }

  const handleSteamLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'custom:steam' as any,
      options: { redirectTo: window.location.origin + '/cabinet' }
    })
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6 flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        <Link href="/" className="text-blue-400 hover:underline text-sm">← На главную</Link>
        <h1 className="text-3xl font-bold">Вход</h1>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" required
            className="w-full px-4 py-2 rounded-xl bg-gray-800 border border-gray-700" />
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Пароль" required
            className="w-full px-4 py-2 rounded-xl bg-gray-800 border border-gray-700" />
          <button type="submit" disabled={loading}
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold disabled:opacity-50">
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <div className="flex items-center gap-4">
          <div className="flex-1 border-t border-gray-700"></div>
          <span className="text-gray-500 text-sm">или</span>
          <div className="flex-1 border-t border-gray-700"></div>
        </div>

        <button onClick={handleSteamLogin}
          className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold">
          Войти через Steam
        </button>

        <p className="text-center text-gray-500 text-sm">
          Нет аккаунта? <Link href="/signup" className="text-blue-400 hover:underline">Регистрация</Link>
        </p>
      </div>
    </main>
  )
}