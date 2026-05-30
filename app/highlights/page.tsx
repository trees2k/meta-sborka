'use client'

import { Protected } from '@/lib/protected'
import { TopBar } from '@/components/top-bar'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Star, Upload, Loader2 } from 'lucide-react'

interface Highlight {
  id: string
  user_id: string
  video_url: string
  title: string
  description: string
  thumbnail_url: string
  created_at: string
}

export default function HighlightsPage() {
  const { user } = useAuth()
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video_url: '',
    thumbnail_url: '',
  })

  useEffect(() => {
    if (user) {
      fetchHighlights()
    }
  }, [user])

  const fetchHighlights = async () => {
    try {
      const res = await fetch(`/api/highlights?userId=${user?.id}`)
      const data = await res.json()
      setHighlights(data.highlights || [])
    } catch (error) {
      console.error('Error fetching highlights:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setUploading(true)
    try {
      const res = await fetch('/api/highlights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          ...formData,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setHighlights([data.highlight, ...highlights])
        setFormData({ title: '', description: '', video_url: '', thumbnail_url: '' })
      }
    } catch (error) {
      console.error('Error uploading highlight:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Protected>
      <TopBar />
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Мои хайлайты</h1>

          {/* Upload Form */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-bold mb-4">Загрузить новый хайлайт</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Название"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <textarea
                placeholder="Описание"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
              <input
                type="url"
                placeholder="URL видео"
                value={formData.video_url}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="url"
                placeholder="URL миниатюры (превью)"
                value={formData.thumbnail_url}
                onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={uploading}
                className="w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Загрузка...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Загрузить
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Highlights Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : highlights.length === 0 ? (
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-12 text-center">
              <Star className="w-12 h-12 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">Нет хайлайтов. Загрузи свой первый!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {highlights.map((highlight) => (
                <div key={highlight.id} className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden hover:border-gray-600 transition-all">
                  {highlight.thumbnail_url && (
                    <img
                      src={highlight.thumbnail_url}
                      alt={highlight.title}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-bold truncate">{highlight.title}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2">{highlight.description}</p>
                    <p className="text-gray-500 text-xs mt-2">
                      {new Date(highlight.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Protected>
  )
}
