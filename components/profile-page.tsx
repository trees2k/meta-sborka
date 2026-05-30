'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { MessageCircle, UserPlus, MoreVertical, Heart, Users } from 'lucide-react'
import ChatSidebar from './chat-sidebar'

interface PlayerProfile {
  id: string
  email: string
  faceit_elo: number
  premier_points: number
  main_role: string
  communication_style: string
  tilt_reaction: string
  main_goal: string
  faceit_nickname: string
}

interface Highlight {
  id: string
  video_url: string
  title: string
  description: string
  thumbnail_url: string
  created_at: string
}

interface ProfilePageProps {
  userId: string
}

export default function ProfilePage({ userId }: ProfilePageProps) {
  const { user: currentUser } = useAuth()
  const [profile, setProfile] = useState<PlayerProfile | null>(null)
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [selectedHighlight, setSelectedHighlight] = useState<Highlight | null>(null)
  const [loading, setLoading] = useState(true)
  const [chatOpen, setChatOpen] = useState(false)

  useEffect(() => {
    fetchProfile()
    fetchHighlights()
  }, [userId])

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/profile/${userId}`)
      const data = await res.json()
      setProfile(data.profile)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const fetchHighlights = async () => {
    try {
      const res = await fetch(`/api/highlights?userId=${userId}`)
      const data = await res.json()
      setHighlights(data.highlights || [])
      if (data.highlights?.length > 0) {
        setSelectedHighlight(data.highlights[0])
      }
    } catch (error) {
      console.error('Error fetching highlights:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-950 text-white p-6 flex items-center justify-center">Загрузка...</div>
  }

  if (!profile) {
    return <div className="min-h-screen bg-gray-950 text-white p-6 flex items-center justify-center">Профиль не найден</div>
  }

  const isOwnProfile = currentUser?.id === userId

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Profile Info */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 sticky top-24">
              <div className="space-y-4">
                {/* Avatar */}
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto flex items-center justify-center text-3xl font-bold">
                  {profile.faceit_nickname?.[0]?.toUpperCase() || 'U'}
                </div>

                {/* Nickname */}
                <div className="text-center">
                  <h1 className="text-2xl font-bold">{profile.faceit_nickname || profile.email}</h1>
                  <p className="text-gray-400 text-sm">{profile.email}</p>
                </div>

                {/* Stats */}
                <div className="space-y-3 border-t border-gray-700 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Faceit ELO</span>
                    <span className="text-emerald-400 font-bold text-lg">{profile.faceit_elo || 800}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Premier Points</span>
                    <span className="text-blue-400 font-bold text-lg">{profile.premier_points || 0}</span>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="space-y-3 border-t border-gray-700 pt-4 text-sm">
                  <div>
                    <p className="text-gray-400">Основная роль</p>
                    <p className="text-white font-semibold">{profile.main_role || 'Не указана'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Стиль общения</p>
                    <p className="text-white font-semibold">{profile.communication_style || 'Не указан'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Реакция на тильт</p>
                    <p className="text-white font-semibold">{profile.tilt_reaction || 'Не указана'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Главная цель</p>
                    <p className="text-white font-semibold">{profile.main_goal || 'Не указана'}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                {!isOwnProfile && (
                  <div className="space-y-2 border-t border-gray-700 pt-4">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-colors">
                      <UserPlus className="w-5 h-5" />
                      Добавить
                    </button>
                    <button
                      onClick={() => setChatOpen(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Написать
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Center - Highlights */}
          <div className="lg:col-span-7">
            <div className="space-y-6">
              {/* Main Video */}
              {selectedHighlight ? (
                <div className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden">
                  <div className="aspect-[9/16] bg-gray-900 flex items-center justify-center relative">
                    {selectedHighlight.thumbnail_url ? (
                      <img
                        src={selectedHighlight.thumbnail_url}
                        alt={selectedHighlight.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-500">Видео недоступно</div>
                    )}
                    {/* Video Controls */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button className="p-2 bg-gray-900/80 hover:bg-gray-800 rounded-lg transition-colors">
                        <Heart className="w-5 h-5" />
                      </button>
                      <button className="p-2 bg-gray-900/80 hover:bg-gray-800 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Navigation */}
                    {highlights.length > 1 && (
                      <>
                        <button
                          onClick={() => {
                            const current = highlights.indexOf(selectedHighlight)
                          const prev = (current - 1 + highlights.length) % highlights.length
                            setSelectedHighlight(highlights[prev])
                          }}
                          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-gray-900/80 hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          ←
                        </button>
                        <button
                          onClick={() => {
                            const current = highlights.indexOf(selectedHighlight)
                            const next = (current + 1) % highlights.length
                            setSelectedHighlight(highlights[next])
                          }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-gray-900/80 hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          →
                        </button>
                      </>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4 space-y-2">
                    <h2 className="text-lg font-bold">{selectedHighlight.title}</h2>
                    <p className="text-gray-400 text-sm">{selectedHighlight.description}</p>
                    <p className="text-gray-500 text-xs">
                      {new Date(selectedHighlight.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="px-4 pb-4 flex gap-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-400">
                      <Heart className="w-4 h-4" />
                      1.2K
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <MessageCircle className="w-4 h-4" />
                      42
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 text-center">
                  <p className="text-gray-400">Нет хайлайтов</p>
                </div>
              )}

              {/* Grid */}
              <div>
                <h3 className="text-lg font-bold mb-4">Все хайлайты</h3>
                <div className="grid grid-cols-3 gap-3">
                  {highlights.map((highlight) => (
                    <button
                      key={highlight.id}
                      onClick={() => setSelectedHighlight(highlight)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedHighlight?.id === highlight.id
                          ? 'border-blue-500'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      {highlight.thumbnail_url ? (
                        <img
                          src={highlight.thumbnail_url}
                          alt={highlight.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                          🎬
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Chat */}
          {chatOpen && (
            <div className="lg:col-span-3">
              <ChatSidebar targetUserId={userId} onClose={() => setChatOpen(false)} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
