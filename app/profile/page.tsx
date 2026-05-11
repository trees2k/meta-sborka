'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function ProfilePage() {
  const { nickname } = useParams<{ nickname: string }>()
  const [profile, setProfile] = useState<any>(null)
  const [highlights, setHighlights] = useState<any[]>([])
  const [isFollowing, setIsFollowing] = useState(false)
  const [followerCount, setFollowerCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)

  useEffect(() => {
    fetch(`/api/faceit?nickname=${nickname}`)
      .then(r => r.json())
      .then(data => setProfile(data))

    fetch(`/api/highlights?nickname=${nickname}`)
      .then(r => r.json())
      .then(data => setHighlights(data.highlights || []))

    const currentUser = localStorage.getItem('currentNickname')
    if (currentUser) {
      fetch(`/api/social/follow?follower=${currentUser}&followee=${nickname}`)
        .then(r => r.json())
        .then(data => setIsFollowing(data.following))
    }

    fetch(`/api/social/follow?followee=${nickname}`)
      .then(r => r.json())
      .then(data => setFollowerCount(data.count || 0))
    fetch(`/api/social/follow?follower=${nickname}`)
      .then(r => r.json())
      .then(data => setFollowingCount(data.count || 0))
  }, [nickname])

  const handleFollow = async () => {
    const currentUser = localStorage.getItem('currentNickname')
    if (!currentUser) return alert('Войдите под своим ником')
    const res = await fetch('/api/social/follow', {
      method: isFollowing ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ follower: currentUser, followee: nickname })
    })
    if (res.ok) setIsFollowing(!isFollowing)
  }

  if (!profile) return <div className="min-h-screen bg-gray-950 text-white p-6">Загрузка...</div>

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-6 mb-8">
          <img src={profile.avatar} className="w-24 h-24 rounded-full" />
          <div>
            <h1 className="text-3xl font-bold">{profile.nickname}</h1>
            <p className="text-gray-400">ELO {profile.elo}</p>
            <div className="flex gap-4 mt-2 text-sm">
              <span><strong>{followerCount}</strong> подписчиков</span>
              <span><strong>{followingCount}</strong> подписок</span>
            </div>
            <button onClick={handleFollow} className="mt-2 px-4 py-1 bg-blue-500 rounded-full text-sm">
              {isFollowing ? 'Отписаться' : 'Подписаться'}
            </button>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Хайлайты</h2>
        {highlights.length === 0 ? (
          <p className="text-gray-400">Пока нет хайлайтов</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((h: any) => (
              <HighlightCard key={h.id} highlight={h} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

function HighlightCard({ highlight }: { highlight: any }) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [comments, setComments] = useState<any[]>([])
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')

  useEffect(() => {
    const user = localStorage.getItem('currentNickname') || 'anonymous'
    fetch(`/api/social/like?highlight_id=${highlight.id}&user_nickname=${encodeURIComponent(user)}`)
      .then(r => r.json())
      .then(data => {
        setLikeCount(data.count || 0)
        setLiked(Boolean(data.liked))
      })
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
    if (res.ok) {
      setLiked(!liked)
      setLikeCount(prev => liked ? prev - 1 : prev + 1)
    }
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
      setShowComments(false)
      const updated = await fetch(`/api/social/comment?highlight_id=${highlight.id}`)
      const data = await updated.json()
      setComments(data.comments || [])
    }
  }

  return (
    <div className="bg-gray-800/50 rounded-2xl overflow-hidden">
      <video src={highlight.video_url} controls className="w-full aspect-video object-cover" />
      <div className="p-4">
        <p className="font-semibold">{highlight.title || 'Без названия'}</p>
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
          <button onClick={toggleLike} className={liked ? 'text-red-400' : ''}>
            ❤️ {likeCount}
          </button>
          <button onClick={() => setShowComments(!showComments)}>💬 {comments.length}</button>
        </div>
        {showComments && (
          <div className="mt-2 bg-gray-900 p-2 rounded max-h-40 overflow-y-auto">
            {comments.map((c: any) => (
              <p key={c.id} className="text-xs"><strong>{c.user_nickname}:</strong> {c.text}</p>
            ))}
            <div className="flex gap-2 mt-2">
              <input
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addComment()}
                placeholder="Комментарий..."
                className="flex-1 px-2 py-1 text-black rounded text-sm"
              />
              <button onClick={addComment} className="px-2 py-1 bg-blue-500 rounded text-sm">Отпр.</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}