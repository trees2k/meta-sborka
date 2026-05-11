'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SetupPage() {
  const [nickname, setNickname] = useState('')
  const [currentNickname, setCurrentNickname] = useState('')
  const [error, setError] = useState('')
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
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const checkRes = await fetch(`/api/faceit?nickname=${encodeURIComponent(nickname)}`)
    const checkData = await checkRes.json()
    if (checkData.error) {
      setError('Игрок не найден на Faceit')
      return
    }
    const res = await fetch('/api/profile/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ faceit_nickname: nickname })
    })
    if (res.ok) {
      router.push(`/profile/${nickname}`)
    } else {
      const data = await res.json()
      setError(data.error || 'Ошибка сохранения')
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-3xl font-bold mb-6">
          {currentNickname ? 'Изменить никнейм Faceit' : 'Привяжи Faceit'}
        </h1>
        {currentNickname && (
          <p className="text-gray-400 mb-4">Текущий ник: <strong>{currentNickname}</strong></p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            placeholder="Твой никнейм на Faceit"
            required
            className="w-full px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold">
            Сохранить
          </button>
        </form>
      </div>
    </main>
  )
}