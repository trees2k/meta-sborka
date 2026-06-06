'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  MessageCircle, Send, ArrowLeft, Menu, X,
  Play, BarChart3, Users, Search
} from 'lucide-react'

// ─── Sidebar ─────────────────────────────────────────────────────────────────
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
          <p className="text-xs text-gray-500 mt-1">Сообщения</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {[
            { href: '/', label: 'Главная', icon: BarChart3 },
            { href: '/highlights', label: 'Хайлайты', icon: Play },
            { href: '/cabinet', label: 'Кабинет', icon: BarChart3 },
            { href: '/anketa', label: 'Найти команду', icon: Users },
          ].map(item => (
            <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all">
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800/50">
          {nickname && (
            <Link href={`/profile/${nickname}`} className="flex items-center gap-2 px-4 py-3 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
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

// ─── Chat Window ──────────────────────────────────────────────────────────────
function ChatWindow({ chatId, otherNickname, myNickname, onBack }: {
  chatId: string
  otherNickname: string
  myNickname: string
  onBack: () => void
}) {
  const [messages, setMessages] = useState<any[]>([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(`/api/chats/${chatId}/messages`)
      .then(r => r.json())
      .then(data => setMessages(data.messages || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [chatId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!text.trim()) return
    const content = text
    setText('')
    const res = await fetch(`/api/chats/${chatId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, sender_nickname: myNickname })
    })
    if (res.ok) {
      const data = await res.json()
      setMessages(prev => [...prev, { ...data.message, is_mine: true }])
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-800/50 bg-gray-950/50">
        <button onClick={onBack} className="md:hidden text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
          {otherNickname[0]?.toUpperCase()}
        </div>
        <div className="flex-1">
          <p className="font-semibold">{otherNickname}</p>
          <p className="text-xs text-gray-500">В сети</p>
        </div>
        <Link href={`/profile/${otherNickname}`} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
          Профиль
        </Link>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <MessageCircle size={40} className="text-gray-700 mb-3" />
            <p className="text-gray-500 text-sm">Начни диалог с {otherNickname}</p>
          </div>
        ) : (
          messages.map((m: any, i: number) => {
            const isMine = m.sender_nickname === myNickname || m.is_mine
            return (
              <div key={m.id || i} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-sm px-4 py-2.5 rounded-2xl text-sm ${
                  isMine
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-sm'
                    : 'bg-gray-800 text-gray-100 rounded-bl-sm'
                }`}>
                  <p>{m.content}</p>
                  <p className={`text-xs mt-1 ${isMine ? 'text-blue-200' : 'text-gray-500'}`}>
                    {m.created_at ? new Date(m.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : ''}
                  </p>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-gray-800/50 bg-gray-950/50 flex gap-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
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
  )
}

// ─── Main Messages Page ───────────────────────────────────────────────────────
export default function MessagesPage() {
  const [chats, setChats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [myNickname, setMyNickname] = useState('')
  const [myUserId, setMyUserId] = useState('')
  const [selectedChat, setSelectedChat] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [nicknames, setNicknames] = useState<Record<string, string>>({})
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(async data => {
        if (data.user) {
          setMyNickname(data.user.faceit_nickname || '')
          setMyUserId(data.user.id)
          // Загружаем чаты
          const chatsRes = await fetch('/api/chats')
          const chatsData = await chatsRes.json()
          const chatList = chatsData.chats || []
          setChats(chatList)

          // Получаем никнеймы собеседников
          const otherIds = chatList.map((c: any) =>
            c.user1_id === data.user.id ? c.user2_id : c.user1_id
          )
          const uniqueIds = [...new Set(otherIds)] as string[]

          const nickMap: Record<string, string> = {}
          await Promise.all(uniqueIds.map(async (id: string) => {
            try {
              const res = await fetch(`/api/profile/user/${id}`)
              const d = await res.json()
              nickMap[id] = d.nickname || d.faceit_nickname || `User ${id.slice(0, 6)}`
            } catch {
              nickMap[id] = `User ${id.slice(0, 6)}`
            }
          }))
          setNicknames(nickMap)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const getOtherId = (chat: any) => {
    return chat.user1_id === myUserId ? chat.user2_id : chat.user1_id
  }

  const getOtherNickname = (chat: any) => {
    const otherId = getOtherId(chat)
    return nicknames[otherId] || `User ${otherId.slice(0, 6)}`
  }

  const filteredChats = chats.filter(c =>
    getOtherNickname(c).toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white flex">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-gray-800 p-2 rounded-xl"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <Sidebar nickname={myNickname} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="flex-1 flex min-h-screen">
        {/* Список чатов */}
        <div className={`${selectedChat ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 border-r border-gray-800/50 bg-gray-950/30`}>
          <div className="p-4 border-b border-gray-800/50">
            <h2 className="text-xl font-black mb-3">Сообщения</h2>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Поиск..."
                className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <MessageCircle size={40} className="text-gray-700 mb-3" />
                <p className="text-gray-400 font-semibold mb-1">Нет диалогов</p>
                <p className="text-gray-500 text-sm">Напиши кому-нибудь через их профиль</p>
              </div>
            ) : (
              filteredChats.map(chat => {
                const otherNick = getOtherNickname(chat)
                const isSelected = selectedChat?.id === chat.id
                return (
                  <button
                    key={chat.id}
                    onClick={() => setSelectedChat({ ...chat, otherNickname: otherNick })}
                    className={`w-full flex items-center gap-3 px-4 py-4 border-b border-gray-800/30 text-left transition-all hover:bg-gray-800/30 ${isSelected ? 'bg-gray-800/50' : ''}`}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {otherNick[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{otherNick}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {chat.last_message_at
                          ? new Date(chat.last_message_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
                          : 'Нет сообщений'}
                      </p>
                    </div>
                    <MessageCircle size={14} className="text-gray-600 flex-shrink-0" />
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Окно чата */}
        <div className={`${selectedChat ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
          {selectedChat ? (
            <ChatWindow
              chatId={selectedChat.id}
              otherNickname={selectedChat.otherNickname}
              myNickname={myNickname}
              onBack={() => setSelectedChat(null)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <MessageCircle size={56} className="text-gray-700 mb-4" />
              <h3 className="text-xl font-bold mb-2">Выбери диалог</h3>
              <p className="text-gray-500 text-sm max-w-xs">
                Выбери чат слева или напиши кому-нибудь через их профиль
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
