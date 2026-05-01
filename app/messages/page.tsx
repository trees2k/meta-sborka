'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function MessagesContent() {
  const searchParams = useSearchParams()
  const toUser = searchParams.get('to') || ''
  const [myNick, setMyNick] = useState('')
  const [chatWith, setChatWith] = useState(toUser)
  const [messages, setMessages] = useState<any[]>([])
  const [text, setText] = useState('')
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('currentNickname')
    if (saved) setMyNick(saved)
    if (toUser) setChatWith(toUser)
  }, [toUser])

  useEffect(() => {
    if (!myNick || !chatWith) return
    fetch(`/api/messages?user1=${encodeURIComponent(myNick)}&user2=${encodeURIComponent(chatWith)}`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setMessages(data) })
      .catch(() => {})
  }, [myNick, chatWith, sent])

  const handleSend = async () => {
    if (!text.trim() || !myNick || !chatWith) return
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from_nickname: myNick, to_nickname: chatWith, text })
    })
    setText('')
    setSent(!sent)
  }

  if (!myNick) {
    return (
      <main className="min-h-screen bg-gray-950 text-white p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Сообщения</h1>
        <p className="text-gray-400 mb-4">Сначала войди в кабинет, чтобы писать сообщения.</p>
        <Link href="/cabinet" className="text-blue-400 hover:underline">Войти в кабинет</Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-blue-400 hover:underline text-sm">← На главную</Link>
        <h1 className="text-3xl font-bold mt-4 mb-2">Сообщения</h1>

        {!chatWith ? (
          <div className="mt-8">
            <p className="text-gray-400 mb-4">С кем хочешь начать чат?</p>
            <form onSubmit={e => { e.preventDefault(); const i = (e.target as any).nick; setChatWith(i.value) }}>
              <div className="flex gap-2">
                <input name="nick" type="text" placeholder="Никнейм игрока" className="flex-1 px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white" />
                <button type="submit" className="px-4 py-2 bg-blue-500 rounded-xl font-semibold">Начать</button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mt-4 mb-6">
              <p className="text-gray-400">Чат с</p>
              <Link href={`/profile/${chatWith}`} className="text-blue-400 font-semibold hover:underline">{chatWith}</Link>
              <button onClick={() => setChatWith('')} className="text-gray-500 text-sm ml-2 hover:text-white">✕</button>
            </div>

            <div className="bg-gray-800/30 rounded-2xl p-4 h-96 overflow-y-auto space-y-3 mb-4">
              {messages.length === 0 && <p className="text-gray-500 text-center mt-20">Нет сообщений. Напиши первым!</p>}
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.from_nickname === myNick ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] px-4 py-2 rounded-xl text-sm ${m.from_nickname === myNick ? 'bg-blue-500' : 'bg-gray-700'}`}>
                    {m.text}
                    <p className="text-[10px] opacity-60 mt-1">{new Date(m.created_at).toLocaleTimeString().slice(0,5)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Сообщение..."
                className="flex-1 px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white"
              />
              <button onClick={handleSend} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold">Отправить</button>
            </div>
          </>
        )}
      </div>
    </main>
  )
}

export default function Messages() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">Загрузка...</div>}>
      <MessagesContent />
    </Suspense>
  )
}