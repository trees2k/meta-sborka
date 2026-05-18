'use client'

import { useEffect, useState, useRef } from 'react'
import { Heart, MessageCircle, Share2, ChevronUp, ChevronDown } from 'lucide-react'
import Link from 'next/link'

const mapColors: Record<string, string> = {
  'de_mirage': 'from-amber-900 via-orange-950 to-yellow-950',
  'de_dust2': 'from-yellow-900 via-amber-950 to-orange-950',
  'de_inferno': 'from-red-900 via-rose-950 to-orange-950',
  'de_nuke': 'from-slate-800 via-blue-950 to-cyan-950',
  'de_ancient': 'from-emerald-900 via-green-950 to-teal-950',
  'de_anubis': 'from-amber-900 via-yellow-950 to-stone-950',
  'de_vertigo': 'from-sky-900 via-blue-950 to-indigo-950',
  'de_overpass': 'from-green-900 via-emerald-950 to-lime-950',
}

export default function HighlightsPage() {
  const [highlights, setHighlights] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<any[]>([])
  const [commentText, setCommentText] = useState('')
  const [heartAnim, setHeartAnim] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const lastTap = useRef(0)

  const myNickname = typeof window !== 'undefined'
    ? localStorage.getItem('currentNickname') || 'anonymous'
    : 'anonymous'

  useEffect(() => {
    fetch('/api/highlights/feed')
      .then(r => r.json())
      .then(data => setHighlights(data.highlights || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleLike = async (id: string) => {
    const res = await fetch('/api/highlights/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ highlight_id: id, nickname: myNickname })
    })
    const data = await res.json()
    if (data.liked) {
      setLikedIds(prev => new Set([...prev, id]))
      setHighlights(prev => prev.map(h => h.id === id ? { ...h, likes: (h.likes || 0) + 1 } : h))
    } else {
      setLikedIds(prev => { const n = new Set(prev); n.delete(id); return n })
      setHighlights(prev => prev.map(h => h.id === id ? { ...h, likes: Math.max(0, (h.likes || 0) - 1) } : h))
    }
  }

  const handleDoubleTap = (id: string) => {
    const now = Date.now()
    if (now - lastTap.current < 300) {
      if (!likedIds.has(id)) handleLike(id)
      setHeartAnim(true)
      setTimeout(() => setHeartAnim(false), 800)
    }
    lastTap.current = now
  }

  const loadComments = async (id: string) => {
    const res = await fetch(`/api/highlights/comments?highlight_id=${id}`)
    const data = await res.json()
    setComments(data.comments || [])
    setShowComments(true)
  }

  const sendComment = async () => {
    if (!commentText.trim()) return
    const h = highlights[currentIndex]
    await fetch('/api/highlights/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ highlight_id: h.id, nickname: myNickname, text: commentText })
    })
    setCommentText('')
    loadComments(h.id)
    setHighlights(prev => prev.map(x => x.id === h.id ? { ...x, comments: (x.comments || 0) + 1 } : x))
  }

  const goTo = (dir: number) => {
    setShowComments(false)
    setCurrentIndex(prev => Math.max(0, Math.min(highlights.length - 1, prev + dir)))
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') goTo(-1)
      if (e.key === 'ArrowDown') goTo(1)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [highlights.length])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    let startY = 0
    const onStart = (e: TouchEvent) => { startY = e.touches[0].clientY }
    const onEnd = (e: TouchEvent) => {
      const diff = startY - e.changedTouches[0].clientY
      if (Math.abs(diff) > 50) goTo(diff > 0 ? 1 : -1)
    }
    el.addEventListener('touchstart', onStart)
    el.addEventListener('touchend', onEnd)
    return () => { el.removeEventListener('touchstart', onStart); el.removeEventListener('touchend', onEnd) }
  }, [highlights.length])

  if (loading) {
    return <div className="h-screen bg-black text-white flex items-center justify-center">Загрузка хайлайтов...</div>
  }

  if (highlights.length === 0) {
    return (
      <div className="h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <p className="text-6xl">🎬</p>
        <p className="text-xl font-bold">Пока нет хайлайтов</p>
        <p className="text-gray-400">Загрузите демку в кабинете чтобы найти крутые моменты</p>
        <Link href="/cabinet" className="px-6 py-3 bg-blue-500 rounded-xl font-semibold">Перейти в кабинет</Link>
      </div>
    )
  }

  const h = highlights[currentIndex]
  const bgColor = mapColors[h.map] || 'from-gray-900 via-gray-950 to-black'

  return (
    <div ref={containerRef} className="h-screen w-full overflow-hidden bg-black relative select-none">
       {/* Карточка хайлайта */}
      <div
        className={`h-full w-full flex flex-col items-center justify-center relative transition-all duration-300 ${!h.video_url ? `bg-gradient-to-b ${bgColor}` : 'bg-black'}`}
        onClick={() => handleDoubleTap(h.id)}
      >
        {/* Видео фон */}
        {h.video_url && (
          <video
            key={h.video_url}
            src={h.video_url}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-contain z-0"
          />
        )}

        {/* Контент поверх видео (только если нет видео) */}
        {!h.video_url && (
          <div className="text-center px-8 max-w-lg z-10">
            <p className="text-8xl mb-4 drop-shadow-lg animate-bounce">{h.emoji}</p>
            <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">{h.type}</h1>
            <p className="text-lg text-white/80 mb-6">{h.description}</p>

            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 mb-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">{h.kills}</p>
                  <p className="text-xs text-white/50">KILLS</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{h.deaths}</p>
                  <p className="text-xs text-white/50">DEATHS</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-400">{h.kd?.toFixed(2)}</p>
                  <p className="text-xs text-white/50">K/D</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-white/60">
              <span className="text-sm">🗺️ {h.map}</span>
              {h.round_number && <span className="text-sm">· Раунд {h.round_number}</span>}
            </div>
          </div>
        )}

        {/* Верхняя панель */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
          <Link href="/cabinet" className="text-white/70 hover:text-white text-sm">← Кабинет</Link>
          <p className="text-white/50 text-sm">{currentIndex + 1} / {highlights.length}</p>
        </div>

        {/* Ник игрока */}
        <div className="absolute bottom-24 left-4 z-10">
          <Link href={`/profile/${h.nickname}`} className="flex items-center gap-2 hover:opacity-80">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center font-bold text-sm">
              {h.nickname?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-sm">{h.nickname}</p>
              <p className="text-xs text-white/50">{new Date(h.created_at).toLocaleDateString('ru-RU')}</p>
            </div>
          </Link>
        </div>

        {/* Кнопки справа */}
        <div className="absolute bottom-24 right-4 flex flex-col items-center gap-6 z-10">
          <button onClick={(e) => { e.stopPropagation(); handleLike(h.id) }} className="flex flex-col items-center gap-1">
            <Heart size={28} fill={likedIds.has(h.id) ? '#ef4444' : 'none'} className={likedIds.has(h.id) ? 'text-red-500' : 'text-white'} />
            <span className="text-xs">{h.likes || 0}</span>
          </button>
          <button onClick={(e) => { e.stopPropagation(); loadComments(h.id) }} className="flex flex-col items-center gap-1">
            <MessageCircle size={28} />
            <span className="text-xs">{h.comments || 0}</span>
          </button>
          <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(`${window.location.origin}/highlights?id=${h.id}`) }} className="flex flex-col items-center gap-1">
            <Share2 size={28} />
            <span className="text-xs">Share</span>
          </button>
        </div>

        {/* Навигация */}
        {currentIndex > 0 && (
          <button onClick={() => goTo(-1)} className="absolute top-1/2 -translate-y-12 left-1/2 -translate-x-1/2 opacity-30 hover:opacity-70 z-10">
            <ChevronUp size={40} />
          </button>
        )}
        {currentIndex < highlights.length - 1 && (
          <button onClick={() => goTo(1)} className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-30 hover:opacity-70 animate-bounce z-10">
            <ChevronDown size={40} />
          </button>
        )}

        {/* Анимация лайка */}
        {heartAnim && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <Heart size={120} fill="#ef4444" className="text-red-500 animate-ping" />
          </div>
        )}
      </div>