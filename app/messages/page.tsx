'use client'

import { Protected } from '@/lib/protected'
import { TopBar } from '@/components/top-bar'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { MessageCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface Chat {
  id: string
  user1_id: string
  user2_id: string
  last_message_at: string
  created_at: string
}

export default function MessagesPage() {
  const { user } = useAuth()
  const [chats, setChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchChats()
    }
  }, [user])

  const fetchChats = async () => {
    try {
      const res = await fetch('/api/chats')
      const data = await res.json()
      setChats(data.chats || [])
    } catch (error) {
      console.error('Error fetching chats:', error)
    } finally {
      setLoading(false)
    }
  }

  const getOtherId = (chat: Chat) => {
    return chat.user1_id === user?.id ? chat.user2_id : chat.user1_id
  }

  return (
    <Protected>
      <TopBar />
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
            <MessageCircle className="w-8 h-8" />
            Мои чаты
          </h1>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : chats.length === 0 ? (
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-12 text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">Нет активных чатов. Начни разговор с кем-то!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {chats.map((chat) => (
                <Link
                  key={chat.id}
                  href={`/profile/${getOtherId(chat)}`}
                  className="block bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:bg-gray-800 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Чат #{getOtherId(chat).slice(0, 8)}</p>
                      <p className="text-gray-400 text-sm">
                        Последнее сообщение: {new Date(chat.last_message_at).toLocaleDateString()}
                      </p>
                    </div>
                    <MessageCircle className="w-5 h-5 text-blue-400" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Protected>
  )
}
