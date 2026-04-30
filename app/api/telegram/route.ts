import { NextResponse } from 'next/server'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const BASE_URL = `https://api.telegram.org/bot${BOT_TOKEN}`

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const message = body.message

    if (!message || !message.text) {
      return NextResponse.json({ ok: true })
    }

    const chatId = message.chat.id
    const text = message.text.trim()
    const args = text.split(' ')
    const command = args[0].toLowerCase()

    switch (command) {
      case '/start':
        await sendMessage(chatId, 'Привет! Я бот Meta-Sborka.\n\nКоманды:\n/sleep 7 — записать часы сна\n/mood отличное — записать настроение\n/stats — статистика')
        break

      case '/sleep':
        const hours = parseFloat(args[1])
        if (isNaN(hours) || hours < 0 || hours > 24) {
          await sendMessage(chatId, 'Укажи количество часов, например: /sleep 7')
        } else {
          await sendMessage(chatId, `✅ Сон ${hours} ч. записан. Твой винрейт будет выше!`)
        }
        break

      case '/mood':
        const mood = args.slice(1).join(' ')
        if (!mood) {
          await sendMessage(chatId, 'Укажи настроение, например: /mood отличное')
        } else {
          await sendMessage(chatId, `✅ Настроение "${mood}" записано.`)
        }
        break

      case '/stats':
        await sendMessage(chatId, '📊 Статистика доступна на сайте: https://meta-sborka.vercel.app')
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