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
    const nickname = message.chat.username || 'unknown'

    switch (command) {
      case '/start':
        await sendMessage(chatId, 'Привет! Я бот Meta-Sborka.\n\nКоманды:\n/sleep 7\n/mood отличное\n/stats')
        break

      case '/sleep':
        const hours = parseFloat(args[1])
        if (isNaN(hours) || hours < 0 || hours > 24) {
          await sendMessage(chatId, 'Укажи число, например: /sleep 7')
        } else {
          await supabase.from('sleep_log').insert({ nickname, hours, recorded_at: new Date().toISOString().split('T')[0] })
          await sendMessage(chatId, `✅ Сон ${hours} ч записан.`)
        }
        break

      case '/mood':
        const mood = args.slice(1).join(' ')
        if (!mood) {
          await sendMessage(chatId, 'Укажи настроение, например: /mood отличное')
        } else {
          await supabase.from('mood_log').insert({ nickname, mood, recorded_at: new Date().toISOString().split('T')[0] })
          await sendMessage(chatId, `✅ Настроение "${mood}" записано.`)
        }
        break

      case '/stats':
        const { data: sleepData } = await supabase.from('sleep_log').select('hours').eq('nickname', nickname).order('recorded_at', { ascending: false }).limit(7)
        const avgSleep = sleepData?.length ? (sleepData.reduce((a: number, b: any) => a + b.hours, 0) / sleepData.length).toFixed(1) : '—'
        await sendMessage(chatId, `📊 Твой средний сон за 7 дней: ${avgSleep} ч.\nПолная статистика: https://meta-sborka.vercel.app`)
        break

      default:
        await sendMessage(chatId, 'Команды: /start, /sleep, /mood, /stats')
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
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