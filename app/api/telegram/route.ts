import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const BASE_URL = `https://api.telegram.org/bot${BOT_TOKEN}`

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl!, supabaseKey!)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const message = body.message
    if (!message || !message.text) return NextResponse.json({ ok: true })

    const chatId = message.chat.id
    const text = message.text.trim()
    const args = text.split(' ')
    const command = args[0].toLowerCase()
    const telegramId = String(message.chat.id)

    const { data: link } = await supabase
      .from('user_links')
      .select('faceit_nickname')
      .eq('telegram_id', telegramId)
      .limit(1)
      .single()

    const faceitNick = link?.faceit_nickname || null

    switch (command) {
      case '/start': {
        const tips = [
          'Sleep 7-8 hours before gaming — your accuracy will increase by 15%.',
          'Play between 19:00 and 21:00 for peak win rate.',
          'Take a 5-minute break every 2 games to avoid tilt.',
          'Warm up your wrists for 3 minutes before playing.',
          'Drink water between matches — dehydration slows reaction time.'
        ]
        const tip = tips[Math.floor(Math.random() * tips.length)]
        let msg = 'Ufuture Bot is ready!\n\n'
        msg += 'Commands:\n'
        msg += '/link NICKNAME — connect your Faceit\n'
        msg += '/sleep HOURS — log sleep\n'
        msg += '/mood TEXT — log mood\n'
        msg += '/elo — check your ELO\n'
        msg += '/stats — your stats\n\n'
        msg += 'Today\'s tip: ' + tip
        if (faceitNick) msg += '\n\nYour Faceit: ' + faceitNick
        await sendMessage(chatId, msg)
        break
      }

      case '/link': {
        const nick = args[1]
        if (!nick) { await sendMessage(chatId, 'Usage: /link YOUR_FACEIT_NICKNAME'); break }
        await supabase.from('user_links').upsert({ telegram_id: telegramId, faceit_nickname: nick }, { onConflict: 'telegram_id' })
        await sendMessage(chatId, 'Linked! Your Faceit: ' + nick)
        break
      }

      case '/sleep': {
        const hours = parseFloat(args[1])
        if (isNaN(hours) || hours < 0 || hours > 24) { await sendMessage(chatId, 'Usage: /sleep 7'); break }
        const nick = faceitNick || 'anonymous'
        const { error } = await supabase.from('sleep_log').insert({ nickname: nick, hours, recorded_at: new Date().toISOString().split('T')[0] })
        if (error) { await sendMessage(chatId, 'Error: ' + error.message) }
        else { await sendMessage(chatId, 'Sleep ' + hours + 'h logged for ' + nick) }
        break
      }

      case '/mood': {
        const mood = args.slice(1).join(' ')
        if (!mood) { await sendMessage(chatId, 'Usage: /mood great'); break }
        const nick = faceitNick || 'anonymous'
        const { error } = await supabase.from('mood_log').insert({ nickname: nick, mood, recorded_at: new Date().toISOString().split('T')[0] })
        if (error) { await sendMessage(chatId, 'Error: ' + error.message) }
        else { await sendMessage(chatId, 'Mood "' + mood + '" logged for ' + nick) }
        break
      }

      case '/elo': {
        if (!faceitNick) { await sendMessage(chatId, 'Link your Faceit first: /link NICKNAME'); break }
        const { data } = await supabase.from('elo_history').select('elo').eq('nickname', faceitNick).order('recorded_at', { ascending: false }).limit(1)
        if (data && data.length > 0) {
          const prev = await supabase.from('elo_history').select('elo').eq('nickname', faceitNick).order('recorded_at', { ascending: false }).limit(2)
          const current = data[0].elo
          const previous = prev.data && prev.data.length > 1 ? prev.data[1].elo : current
          const diff = current - previous
          const emoji = diff > 0 ? '📈' : diff < 0 ? '📉' : '➡️'
          await sendMessage(chatId, `${faceitNick}: ${current} ELO ${emoji} ${diff >= 0 ? '+' : ''}${diff}\nFull stats: https://meta-sborka.vercel.app/cabinet?nickname=${faceitNick}`)
        } else {
          await sendMessage(chatId, 'No ELO data yet. Open your cabinet: https://meta-sborka.vercel.app/cabinet?nickname=' + faceitNick)
        }
        break
      }

      case '/stats': {
        if (!faceitNick) { await sendMessage(chatId, 'Link first: /link NICKNAME'); break }
        const { data: sleepData } = await supabase.from('sleep_log').select('hours').eq('nickname', faceitNick).order('recorded_at', { ascending: false }).limit(7)
        const avg = sleepData?.length ? (sleepData.reduce((a: number, b: any) => a + b.hours, 0) / sleepData.length).toFixed(1) : '—'
        await sendMessage(chatId, `${faceitNick}:\nAvg sleep (7 days): ${avg}h\nFull stats: https://meta-sborka.vercel.app/cabinet?nickname=${faceitNick}`)
        break
      }

      default:
        await sendMessage(chatId, 'Commands: /start, /link, /sleep, /mood, /elo, /stats')
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('BOT ERROR:', err)
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