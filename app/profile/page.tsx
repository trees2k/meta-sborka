'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data.user) setUser(data.user)
        else window.location.href = '/auth/login'
      })
      .catch(() => window.location.href = '/auth/login')
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/'
  }

  if (loading) return <main className="min-h-screen bg-gray-950 text-white p-6">Загрузка...</main>
  if (!user) return null

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-blue-400 hover:underline">← На главную</Link>
        <h1 className="text-3xl font-bold mt-4 mb-6">Профиль</h1>
        <div className="bg-gray-800/50 rounded-2xl p-6 space-y-4">
          <div>
            <p className="text-gray-400 text-sm">Email</p>
            <p className="text-lg">{user.email}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Faceit никнейм</p>
            <p className="text-lg">{user.faceit_nickname || 'Не указан'}</p>
          </div>
          {user.faceit_nickname && (
            <Link href={`/cabinet?nickname=${user.faceit_nickname}`}
              className="inline-block px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold">
              В кабинет
            </Link>
          )}
          <button onClick={handleLogout}
            className="block w-full py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl mt-4">
            Выйти
          </button>
        </div>
      </div>
    </main>
  )
}