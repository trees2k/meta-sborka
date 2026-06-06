'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Heart, MessageCircle, Play, Users, Trophy, Star,
  ChevronRight, ArrowLeft, Edit, Upload, Send,
  BarChart3, Zap, Shield, TrendingUp, X, Menu
} from 'lucide-react'

// ─── Sidebar (same as main) ──────────────────────────────────────────────────
function Sidebar({ nickname, sidebarOpen, setSidebarOpen }: {
  nickname: string
  sidebarOpen: boolean
  setSidebarOpen: (v: boolean) => void
}) {
  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-72 bg-gray-950/95 backdrop-blur-md
        border-r border-gray-800/50 flex flex-col z-40
        transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-gray-800/50">
          <Link href="/">
            <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              UFUTURE
            </h1>
          </Link>
          <p className="text-xs text-gray-500 mt-1">Киберспортивная платформа</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {[
            { href: '/', label: 'Главная', icon: BarChart3, color: 'from-blue-500 to-cyan-500' },
            { href: '/highlights', label: 'Хайлайты', icon: Play, color: 'from-pink-500 to-purple-500' },
            { href: '/cabinet', label: 'Кабинет', icon: Trophy, color: 'from-green-500 to-emerald-500' },
            { href: '/anketa', label: 'Найти команду', icon: Users, color: 'from-orange-500 to-red-500' },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all"
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800/50">
          {nickname && (
            <Link href={`/profile/${nickname}`} className="flex items-center gap-2 px-4 py-3 bg-gray-800/50 rounded-xl">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold">
                {nickname[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold">{nickname}</p>
                <p className="text-xs text-gray-500">Профиль</p>
              </div>
            </Link>
          )}
        </div>
      </aside>
    </>
  )
}

// ─── Highlight Card ───────────────────────────────────────────────────────────
function HighlightCard({ highlight, isOwner }: { highlight: any; isOwner: boolean }) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [comments, setComments] = useState<any[]>([])
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')

  useEffect(() => {
    const user = localStorage.getItem('currentNickname') || 'anonymous'
    fetch(`/api/social/like?highlight_id=${highlight.id}&user_nickname=${encodeURIComponent(user)}`)
      .then(r => r.json())
      .then(data => { setLikeCount(data.count || 0); setLiked(Boolean(data.liked)) })
      .catch(() => {})
    fetch(`/api/social/comment?highlight_id=${highlight.id}`)
      .then(r => r.json())
      .then(data => setComments(data.comments || []))
      .catch(() => {})
  }, [highlight.id])

  const toggleLike = async () => {
    const user = localStorage.getItem('currentNickname') || 'anonymous'
    const res = await fetch('/api/social/like', {
      method: liked ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_nickname: user, highlight_id: highlight.id })
    })
    if (res.ok) { setLiked(!liked); setLikeCount(prev => liked ? prev - 1 : prev + 1) }
  }

  const addComment = async () => {
    if (!commentText.trim()) return
    const user = localStorage.getItem('currentNickname') || 'anonymous'
    const res = await fetch('/api/social/comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ highlight_id: highlight.id, user_nickname: user, text: commentText })
    })
    if (res.ok) {
      setCommentText('')
      const updated = await fetch(`/api/social/comment?highlight_id=${highlight.id}`)
      const data = await updated.json()
      setComments(data.comments || [])
    }
  }

  return (
    <div className="bg-gray-800/50 rounded-2xl overflow-hidden hover:bg-gray-800/80 transition-all group">
      <div className="relative aspect-video overflow-hidden">
        <video src={highlight.video_url} controls className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="p-4">
        <p className="font-semibold text-sm mb-3">{highlight.title || 'Без названия'}</p>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleLike}
            className={`flex items-center gap-1.5 text-sm transition-colors ${liked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'}`}
          >
            <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
            <span>{likeCount}</span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <MessageCircle size={16} />
            <span>{comments.length}</span>
          </button>
        </div>

        {showComments && (
          <div className="mt-3 bg-gray-900/80 rounded-xl p-3 max-h-40 overflow-y-auto space-y-2">
            {comments.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-2">Нет комментариев</p>
            ) : (
              comments.map((c: any) => (
                <p key={c.id} className="text-xs">
                  <strong className="text-blue-400">{c.user_nickname}:</strong>{' '}
                  <span className="text-gray-300">{c.text}</span>
                </p>
              ))
            )}
            <div className="flex gap-2 pt-1 border-t border-gray-700/50">
              <input
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addComment()}
                placeholder="Комментарий..."
                className="flex-1 bg-gray-800 rounded-lg px-2 py-1 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button onClick={addComment} className="px-2 py-1 bg-blue-500 hover:bg-blue-600 rounded-lg text-xs font-semibold transition-colors">
                <Send size={12} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Direct Messages Modal ────────────────────────────────────────────────────
function DirectModal({ targetNickname, onClose }: { targetNickname: string; onClose: () => void }) {
  const [messages, setMessages] = useState<any[]>([])
  const [text, setText] = useState('')
  const [chatId, setChatId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Получаем или создаём чат
    fetch(`/api/chats/with/${targetNickname}`)
      .then(r => r.json())
      .then(data => {
        if (data.chat) {
          setChatId(data.chat.id)
          return fetch(`/api/chats/${data.chat.id}/messages`)
        }
      })
      .then(r => r?.json())
      .then(data => { if (data?.messages) setMessages(data.messages) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [targetNickname])

  const sendMessage = async () => {
    if (!text.trim() || !chatId) return
    const res = await fetch(`/api/chats/${chatId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: text })
    })
    if (res.ok) {
      setText('')
      const data = await res.json()
      setMessages(prev => [...prev, data.message])
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-gray-900 rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-gray-700/50" style={{ height: '520px' }}>
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-800 bg-gray-950/80">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
            {targetNickname[0]?.toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">{targetNickname}</p>
            <p className="text-xs text-gray-500">Личное сообщение</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <MessageCircle size={40} className="text-gray-700 mb-3" />
              <p className="text-gray-500 text-sm">Начните диалог с {targetNickname}</p>
            </div>
          ) : (
            messages.map((m: any) => (
              <div key={m.id} className={`flex ${m.is_mine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                  m.is_mine
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-sm'
                    : 'bg-gray-800 text-gray-100 rounded-bl-sm'
                }`}>
                  {m.content}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-gray-800 bg-gray-950/50 flex gap-2">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Сообщение..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button
            onClick={sendMessage}
            disabled={!text.trim()}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 disabled:opacity-40 rounded-xl transition-all"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Profile Page ────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { nickname } = useParams<{ nickname: string }>()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [bio, setBio] = useState('')
  const [highlights, setHighlights] = useState<any[]>([])
  const [isFollowing, setIsFollowing] = useState(false)
  const [followerCount, setFollowerCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [totalLikes, setTotalLikes] = useState(0)
  const [isOwner, setIsOwner] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showDirect, setShowDirect] = useState(false)
  const [activeTab, setActiveTab] = useState<'highlights' | 'stats'>('highlights')
  const [myNickname, setMyNickname] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('currentNickname')
    if (saved) setMyNickname(saved)

    fetch(`/api/faceit?nickname=${nickname}`)
      .then(r => r.json())
      .then(data => setProfile(data))
      .catch(() => setProfile(null))

    fetch(`/api/profile/${nickname}`)
      .then(r => r.json())
      .then(data => { if (data?.bio) setBio(data.bio) })
      .catch(() => {})

    fetch(`/api/highlights?nickname=${nickname}`)
      .then(r => r.json())
      .then(data => {
        const hl = data.highlights || []
        setHighlights(hl)
        // Считаем общее число лайков
        Promise.all(hl.map((h: any) =>
          fetch(`/api/social/like?highlight_id=${h.id}&user_nickname=_`)
            .then(r => r.json())
            .then(d => d.count || 0)
            .catch(() => 0)
        )).then(counts => setTotalLikes(counts.reduce((a: number, b: number) => a + b, 0)))
      })
      .catch(() => setHighlights([]))

    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
          if (data.user.faceit_nickname === nickname) setIsOwner(true)
        }
      })
      .catch(() => {})

    fetch(`/api/social/follow?followee=${nickname}`)
      .then(r => r.json())
      .then(data => setFollowerCount(data.count || 0))
      .catch(() => {})

    fetch(`/api/social/follow?follower=${nickname}`)
      .then(r => r.json())
      .then(data => setFollowingCount(data.count || 0))
      .catch(() => {})
  }, [nickname])

  useEffect(() => {
    if (!isOwner && myNickname) {
      fetch(`/api/social/follow?follower=${myNickname}&followee=${nickname}`)
        .then(r => r.json())
        .then(data => setIsFollowing(data.following))
        .catch(() => {})
    }
  }, [isOwner, myNickname, nickname])

  const handleFollow = async () => {
    if (isOwner) return
    if (!myNickname) return alert('Войдите под своим ником')
    const res = await fetch('/api/social/follow', {
      method: isFollowing ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ follower: myNickname, followee: nickname })
    })
    if (res.ok) {
      setIsFollowing(!isFollowing)
      setFollowerCount(prev => isFollowing ? prev - 1 : prev + 1)
    }
  }

  // ELO уровень → цвет
  const eloColor = (elo: number) => {
    if (elo >= 2001) return 'from-red-500 to-orange-500'
    if (elo >= 1501) return 'from-purple-500 to-pink-500'
    if (elo >= 1001) return 'from-blue-500 to-cyan-500'
    return 'from-green-500 to-emerald-500'
  }

  const elo = profile?.elo || 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white flex">
      {/* Кнопка меню мобайл */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-gray-800 p-2 rounded-xl"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <Sidebar nickname={myNickname} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Контент */}
      <main className="flex-1 p-6 md:p-10 max-w-4xl">

        {/* Назад */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 text-sm"
        >
          <ArrowLeft size={16} /> Назад
        </button>

        {!profile ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">

            {/* ─── Hero Card ─── */}
            <div className="bg-gray-800/50 rounded-2xl overflow-hidden">
              {/* Баннер */}
              <div className={`h-24 bg-gradient-to-r ${eloColor(elo)} opacity-30`} />

              <div className="px-6 pb-6">
                {/* Аватар + кнопки */}
                <div className="flex items-end justify-between -mt-10 mb-4">
                  <div className="relative">
                    <img
                      src={profile.avatar || `https://ui-avatars.com/api/?name=${nickname}&background=1e40af&color=fff&size=80`}
                      className="w-20 h-20 rounded-2xl border-4 border-gray-800 object-cover"
                      onError={e => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${nickname}&background=1e40af&color=fff&size=80` }}
                    />
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br ${eloColor(elo)} rounded-full border-2 border-gray-800`} />
                  </div>

                  <div className="flex gap-2 pb-1">
                    {user ? (
                      isOwner ? (
                        <>
                          <Link
                            href="/profile/setup"
                            className="flex items-center gap-1.5 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl text-sm font-medium transition-colors"
                          >
                            <Edit size={14} /> Редактировать
                          </Link>
                          <Link
                            href="/cabinet"
                            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 rounded-xl text-sm font-semibold transition-all"
                          >
                            <Upload size={14} /> Кабинет
                          </Link>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setShowDirect(true)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl text-sm font-medium transition-colors"
                          >
                            <Send size={14} /> Написать
                          </button>
                          <button
                            onClick={handleFollow}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                              isFollowing
                                ? 'bg-gray-700 hover:bg-red-500/20 hover:text-red-400'
                                : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90'
                            }`}
                          >
                            <Users size={14} /> {isFollowing ? 'Отписаться' : 'Подписаться'}
                          </button>
                        </>
                      )
                    ) : (
                      <Link href="/auth/login" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl text-sm font-semibold transition-colors">
                        Войти
                      </Link>
                    )}
                  </div>
                </div>

                {/* Имя + ELO */}
                <div className="mb-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl font-black">{profile.nickname || nickname}</h1>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${eloColor(elo)} text-white`}>
                      ELO {elo}
                    </span>
                  </div>
                  {bio && <p className="text-gray-400 text-sm mt-1 max-w-md">{bio}</p>}
                </div>

                {/* Счётчики */}
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: 'Подписчики', value: followerCount, icon: Users, color: 'text-blue-400' },
                    { label: 'Подписки', value: followingCount, icon: ChevronRight, color: 'text-purple-400' },
                    { label: 'Лайки', value: totalLikes, icon: Heart, color: 'text-red-400' },
                    { label: 'Хайлайты', value: highlights.length, icon: Play, color: 'text-pink-400' },
                  ].map((item, i) => (
                    <div key={i} className="bg-gray-900/50 rounded-xl p-3 text-center">
                      <item.icon size={16} className={`${item.color} mx-auto mb-1`} />
                      <p className="text-lg font-black">{item.value}</p>
                      <p className="text-xs text-gray-500">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ─── Статистика Faceit ─── */}
            <div className="bg-gray-800/50 rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <BarChart3 size={18} className="text-blue-400" /> Статистика Faceit
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Винрейт', value: `${profile.stats?.lifetime?.['Win Rate %'] || '—'}%`, color: 'text-emerald-400' },
                  { label: 'K/D', value: profile.stats?.lifetime?.['Average K/D Ratio'] || '—', color: 'text-blue-400' },
                  { label: 'Матчей', value: profile.stats?.lifetime?.['Matches'] || '—', color: 'text-purple-400' },
                  { label: 'HS%', value: `${profile.stats?.lifetime?.['Average Headshots %'] || '—'}%`, color: 'text-orange-400' },
                ].map((s, i) => (
                  <div key={i} className="bg-gray-900/50 rounded-xl p-4 text-center">
                    <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── Хайлайты ─── */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Play size={18} className="text-pink-400" /> Хайлайты
                </h2>
                {isOwner && (
                  <Link href="/cabinet" className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                    Загрузить <ChevronRight size={14} />
                  </Link>
                )}
              </div>

              {highlights.length === 0 ? (
                <div className="bg-gray-800/50 rounded-2xl p-10 text-center">
                  <Play size={40} className="text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-400">Пока нет хайлайтов</p>
                  {isOwner && (
                    <Link href="/cabinet" className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-sm font-semibold">
                      <Upload size={14} /> Загрузить демку
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {highlights.map((h: any) => (
                    <HighlightCard key={h.id} highlight={h} isOwner={isOwner} />
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </main>

      {/* Direct Modal */}
      {showDirect && (
        <DirectModal targetNickname={nickname} onClose={() => setShowDirect(false)} />
      )}
    </div>
  )
}
