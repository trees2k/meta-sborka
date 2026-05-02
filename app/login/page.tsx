'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    setLoading(false)
    if (data.error) setError(data.error)
    else router.push('/cabinet')
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6 flex items-center justify-center">
      <div className="w-full max-w-md bg-gray-800/50 rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Вход</h1>
        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full px-4 py-2 rounded-xl bg-gray-800 border border-gray-700" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Пароль</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full px-4 py-2 rounded-xl bg-gray-800 border border-gray-700" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold disabled:opacity-50">
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
        <p className="text-gray-400 text-sm text-center mt-4">
          Нет аккаунта? <Link href="/signup" className="text-blue-400 hover:underline">Регистрация</Link>
        </p>
      </div>
    </main>
  )
}