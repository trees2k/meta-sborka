'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    if (data.user) {
      await supabase.from('profiles').insert({ id: data.user.id, nickname })
    }
    window.location.href = '/cabinet'
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6 flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        <Link href="/" className="text-blue-400 hover:underline text-sm">← На главную</Link>
        <h1 className="text-3xl font-bold">Регистрация</h1>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <form onSubmit={handleSignup} className="space-y-4">
          <input value={nickname} onChange={e => setNickname(e.target.value)} placeholder="Никнейм" required
            className="w-full px-4 py-2 rounded-xl bg-gray-800 border border-gray-700" />
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" required
            className="w-full px-4 py-2 rounded-xl bg-gray-800 border border-gray-700" />
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Пароль" required
            className="w-full px-4 py-2 rounded-xl bg-gray-800 border border-gray-700" />
          <button type="submit" disabled={loading}
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold disabled:opacity-50">
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
        <p className="text-center text-gray-500 text-sm">
          Уже есть аккаунт? <Link href="/login" className="text-blue-400 hover:underline">Войти</Link>
        </p>
      </div>
    </main>
  )
}