import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const BASE_URL = `https://api.telegram.org/bot${BOT_TOKEN}`

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const message = body.message
    if (!message || !message.text) return NextResponse.json({ ok: true })

    const chatId = message.chat.id
    const text = message.text.trim()
    const args = text.split(' ')
    const command = args[0].toLowerCase()
    const nickname = message.chat.username || 'anonymous'

    switch (command) {
      case '/start':
        await sendMessage(chatId, 'Hello! I am Meta-Sborka bot.\n\nCommands:\n/sleep 7 - log sleep\n/mood good - log mood\n/stats - see stats')
        break

      case '/sleep':
        const hours = parseFloat(args[1])
        if (isNaN(hours) || hours < 0 || hours > 24) {
          await sendMessage(chatId, 'Please enter a number, e.g. /sleep 7')
        } else {
          const { error } = await supabase.from('sleep_log').insert({ nickname, hours, recorded_at: new Date().toISOString().split('T')[0] })
          if (error) {
            console.error('Supabase insert error:', error)
            await sendMessage(chatId, 'Error saving data.')
          } else {
            await sendMessage(chatId, `Sleep ${hours}h logged.`)
          }
        }
        break

      case '/mood':
        const mood = args.slice(1).join(' ')
        if (!mood) {
          await sendMessage(chatId, 'Please enter your mood, e.g. /mood good')
        } else {
          const { error } = await supabase.from('mood_log').insert({ nickname, mood, recorded_at: new Date().toISOString().split('T')[0] })
          if (error) {
            console.error('Supabase insert error:', error)
            await sendMessage(chatId, 'Error saving data.')
          } else {
            await sendMessage(chatId, `Mood "${mood}" logged.`)
          }
        }
        break

      case '/stats':
        await sendMessage(chatId, 'Stats: https://meta-sborka.vercel.app')
        break

      default:
        await sendMessage(chatId, 'Commands: /start, /sleep, /mood, /stats')
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Bot error:', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

async function sendMessage(chatId: number, text: string) {
  await fetch(`${BASE_URL}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text })
  })
}