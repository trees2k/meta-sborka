'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/lib/auth-context'
import { X, Send, Loader2 } from 'lucide-react'

interface Message {
  id: string
  sender_id: string
  content: string
  created_at: string
}

interface ChatSidebarProps {
  targetUserId: string
  onClose: () => void
}

export default function ChatSidebar({ targetUserId, onClose }: ChatSidebarProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [chatId, setChatId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user) return
    initializeChat()
  }, [user, targetUserId])

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Poll for new messages every 2 seconds
  useEffect(() => {
    if (!chatId) return
    const interval = setInterval(fetchMessages, 2000)
    return () => clearInterval(interval)
  }, [chatId])

  const initializeChat = async () => {
    try {
      const res = await fetch(`/api/chats/with/${targetUserId}`)
      const data = await res.json()
      setChatId(data.chat.id)
      await fetchMessages(data.chat.id)
    } catch (error) {
      console.error('Error initializing chat:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (id?: string) => {
    const cid = id || chatId
    if (!cid) return

    try {
      const res = await fetch(`/api/chats/${cid}/messages`)
      const data = await res.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || !chatId || !user) return

    setSending(true)
    try {
      const res = await fetch(`/api/chats/${chatId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: input,
          sender_id: user.id,
        }),
      })

      if (res.ok) {
        setInput('')
        await fetchMessages()
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-4 h-96 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-2xl flex flex-col h-96 overflow-hidden sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h3 className="font-semibold">Чат</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded-lg transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 text-sm py-8">
            Сообщений нет. Начни разговор!
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-lg ${
                  msg.sender_id === user?.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-100'
                }`}
              >
                <p className="text-sm break-words">{msg.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-700 p-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Напиши сообщение..."
          className="flex-1 px-3 py-2 bg-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          disabled={sending || !input.trim()}
          className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </button>
      </div>
    </div>
  )
}
