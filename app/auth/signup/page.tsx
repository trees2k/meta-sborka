'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (data.error) setError(data.error)
    else setSuccess(true)
  }

  if (success) return (
    <main className="min-h-screen bg-gray-950 text-white p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">Регистрация успешна!</h1>
      <Link href="/auth/login" className="text-blue-400 hover:underline">Войти</Link>
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6">Регистрация</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className="w-full px-4 py-2 rounded-xl bg-gray-800 border border-gray-700" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Пароль (мин. 6 символов)" required className="w-full px-4 py-2 rounded-xl bg-gray-800 border border-gray-700" />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold">Зарегистрироваться</button>
        </form>
        <p className="text-gray-400 text-sm mt-4 text-center">
          Уже есть аккаунт? <Link href="/auth/login" className="text-blue-400 hover:underline">Войти</Link>
        </p>
      </div>
    </main>
  )
}