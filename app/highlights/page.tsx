'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function HighlightsPage() {
  const [highlights, setHighlights] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  // Загрузка списка хайлайтов
  useEffect(() => {
    fetch('/api/highlights')
      .then(r => r.json())
      .then(data => {
        if (data.highlights) setHighlights(data.highlights)
      })
      .finally(() => setLoading(false))
  }, [])

  // Загрузка нового хайлайта
  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const fileInput = form.querySelector('input[type=file]') as HTMLInputElement
    const file = fileInput.files?.[0]
    if (!file) return

    const nickname = localStorage.getItem('currentNickname') || 'anonymous'
    const titleInput = form.querySelector('input[type=text]') as HTMLInputElement

    const formData = new FormData()
    formData.append('video', file)
    formData.append('user_nickname', nickname)
    formData.append('title', titleInput.value)

    setUploading(true)
    try {
      const res = await fetch('/api/highlights', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.ok) {
        // Обновляем список
        setHighlights(prev => [{
          video_url: data.url,
          user_nickname: nickname,
          title: titleInput.value,
          created_at: new Date().toISOString()
        }, ...prev])
        titleInput.value = ''
        fileInput.value = ''
        alert('Хайлайт загружен!')
      } else {
        alert('Ошибка: ' + data.error)
      }
    } catch {
      alert('Ошибка загрузки')
    }
    setUploading(false)
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="text-blue-500 hover:underline">← На главную</Link>
        <h1 className="text-3xl font-bold mt-4 mb-6">Лента хайлайтов</h1>

        {/* Форма загрузки */}
        <div className="bg-gray-800/50 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Загрузить свой хайлайт</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <input
              type="text"
              placeholder="Название момента (необязательно)"
              className="w-full px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white"
            />
            <input
              type="file"
              accept="video/*"
              required
              className="block text-sm"
            />
            <button
              type="submit"
              disabled={uploading}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-700 rounded-xl font-semibold"
            >
              {uploading ? 'Загрузка...' : 'Загрузить'}
            </button>
          </form>
        </div>

        {/* Сетка хайлайтов */}
        {loading ? (
          <p>Загрузка...</p>
        ) : highlights.length === 0 ? (
          <p className="text-gray-400">Пока никто не загрузил хайлайты. Будь первым!</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((h: any) => (
              <div key={h.id} className="bg-gray-800/50 rounded-2xl overflow-hidden">
                <video
                  src={h.video_url}
                  controls
                  className="w-full aspect-video object-cover"
                />
                <div className="p-4">
                  <p className="font-semibold">{h.title || 'Без названия'}</p>
                  <p className="text-sm text-gray-400">{h.user_nickname}</p>
                  <p className="text-xs text-gray-500">{new Date(h.created_at).toLocaleDateString('ru-RU')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}