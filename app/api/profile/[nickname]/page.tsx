'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function ProfilePage() {
  const { nickname } = useParams<{ nickname: string }>()
  const [profile, setProfile] = useState<any>(null)
  const [highlights, setHighlights] = useState<any[]>([])
  const [isFollowing, setIsFollowing] = useState(false)
  const [followerCount, setFollowerCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)

  useEffect(() => {
    // Загружаем профиль
    fetch(`/api/faceit?nickname=${nickname}`)
      .then(r => r.json())
      .then(data => setProfile(data))

    // Загружаем хайлайты пользователя
    fetch(`/api/highlights?nickname=${nickname}`)
      .then(r => r.json())
      .then(data => setHighlights(data.highlights || []))

    // Статус подписки (если текущий пользователь залогинен)
    const currentUser = localStorage.getItem('currentNickname')
    if (currentUser) {
      fetch(`/api/social/follow?follower=${currentUser}&followee=${nickname}`)
        .then(r => r.json())
        .then(data => setIsFollowing(data.following))
    }

    // Количество подписчиков и подписок
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
      body: JSON.stringify({ follower: currentUser, followee: nickname })
    })
    if (res.ok) setIsFollowing(!isFollowing)
  }

  if (!profile) return <div className="min-h-screen bg-gray-950 text-white p-6">Загрузка...</div>

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-3xl mx-auto">
        {/* Профиль */}
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

        {/* Лента хайлайтов */}
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
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                    <LikeButton highlightId={h.id} />
                    <CommentButton highlightId={h.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

// Компоненты-заглушки для лайков и комментариев (реализуем отдельно)
function LikeButton({ highlightId }: { highlightId: number }) {
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(0)
  useEffect(() => {
    fetch(`/api/social/like?highlight_id=${highlightId}`)
      .then(r => r.json())
      .then(data => { setCount(data.count || 0); setLiked(data.liked) })
  }, [highlightId])
  const toggle = async () => {
    const user = localStorage.getItem('currentNickname') || 'anonymous'
    await fetch('/api/social/like', {
      method: liked ? 'DELETE' : 'POST',
      body: JSON.stringify({ user_nickname: user, highlight_id: highlightId })
    })
    setLiked(!liked)
    setCount(liked ? count - 1 : count + 1)
  }
  return <button onClick={toggle}>❤️ {count}</button>
}

function CommentButton({ highlightId }: { highlightId: number }) {
  const [comments, setComments] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  useEffect(() => {
    fetch(`/api/social/comment?highlight_id=${highlightId}`)
      .then(r => r.json())
      .then(data => setComments(data.comments || []))
  }, [highlightId, open])
  const addComment = async (text: string) => {
    const user = localStorage.getItem('currentNickname') || 'anonymous'
    await fetch('/api/social/comment', {
      method: 'POST',
      body: JSON.stringify({ highlight_id: highlightId, user_nickname: user, text })
    })
    setOpen(false)
  }
  return (
    <div>
      <button onClick={() => setOpen(!open)}>💬 {comments.length}</button>
      {open && (
        <div className="mt-2 bg-gray-900 p-2 rounded">
          {comments.map(c => <p key={c.id} className="text-xs"><strong>{c.user_nickname}:</strong> {c.text}</p>)}
          <input onKeyDown={e => { if (e.key === 'Enter') { addComment((e.target as HTMLInputElement).value); (e.target as HTMLInputElement).value = '' } }} placeholder="Комментарий..." className="w-full mt-2 px-2 py-1 text-black rounded text-sm" />
        </div>
      )}
    </div>
  )
}