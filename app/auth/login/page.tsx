'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (data.error) setError(data.error)
    else window.location.href = '/profile'
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-md mx-auto">
        <Link href="/" className="text-blue-400 hover:underline">← На главную</Link>
        <h1 className="text-3xl font-bold mt-4 mb-6">Вход</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold">
            Войти
          </button>
        </form>
        <p className="text-gray-400 text-sm mt-4 text-center">
          Нет аккаунта? <Link href="/auth/signup" className="text-blue-400 hover:underline">Зарегистрироваться</Link>
        </p>
      </div>
    </main>
  )
}