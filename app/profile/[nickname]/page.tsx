'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function ProfilePage() {
  const { nickname } = useParams<{ nickname: string }>()
  const [profile, setProfile] = useState<any>(null)
  const [highlights, setHighlights] = useState<any[]>([])

  useEffect(() => {
    fetch(`/api/faceit?nickname=${nickname}`)
      .then(r => r.json())
      .then(data => setProfile(data))

    fetch(`/api/highlights?nickname=${nickname}`)
      .then(r => r.json())
      .then(data => setHighlights(data.highlights || []))
  }, [nickname])

  if (!profile) return <div className="min-h-screen bg-gray-950 text-white p-6">Загрузка...</div>

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-6 mb-8">
          <img src={profile.avatar} className="w-24 h-24 rounded-full" />
          <div>
            <h1 className="text-3xl font-bold">{profile.nickname}</h1>
            <p className="text-gray-400">ELO {profile.elo}</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Хайлайты</h2>
        {highlights.length === 0 ? (
          <p className="text-gray-400">Пока нет хайлайтов</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((h: any) => (
              <div key={h.id} className="bg-gray-800/50 rounded-2xl overflow-hidden">
                <video src={h.video_url} controls className="w-full aspect-video object-cover" />
                <div className="p-4">
                  <p className="font-semibold">{h.title || 'Без названия'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}