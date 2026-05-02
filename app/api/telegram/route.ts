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
          'Спи 7–8 часов перед игрой — точность вырастет на 15%.',
          'Играй с 19:00 до 21:00 — в это время пик винрейта.',
          'Делай 5-минутный перерыв каждые 2 игры, чтобы избежать тильта.',
          'Разминай кисти 3 минуты перед игрой.',
          'Пей воду между матчами — обезвоживание замедляет реакцию.'
        ]
        const tip = tips[Math.floor(Math.random() * tips.length)]
        let msg = '🤖 Бот Ufuture готов!\n\n'
        msg += 'Доступные команды:\n'
        msg += '/link НИК — привязать Faceit\n'
        msg += '/sleep ЧАСЫ — записать сон\n'
        msg += '/mood НАСТРОЕНИЕ — записать настроение\n'
        msg += '/elo — узнать свой ELO\n'
        msg += '/stats — статистика\n\n'
        msg += '💡 Совет дня: ' + tip
        if (faceitNick) msg += '\n\n🎮 Твой Faceit: ' + faceitNick
        await sendMessage(chatId, msg)
        break
      }

      case '/link': {
        const nick = args[1]
        if (!nick) { await sendMessage(chatId, 'Использование: /link ТВОЙ_НИК'); break }
        await supabase.from('user_links').upsert(
          { telegram_id: telegramId, faceit_nickname: nick },
          { onConflict: 'telegram_id' }
        )
        await sendMessage(chatId, '✅ Faceit привязан: ' + nick)
        break
      }

      case '/sleep': {
        const hours = parseFloat(args[1])
        if (isNaN(hours) || hours < 0 || hours > 24) {
          await sendMessage(chatId, 'Укажи число, например: /sleep 7')
          break
        }
        const nick = faceitNick || 'аноним'
        const { error } = await supabase.from('sleep_log').insert({
          nickname: nick, hours, recorded_at: new Date().toISOString().split('T')[0]
        })
        if (error) { await sendMessage(chatId, '❌ Ошибка: ' + error.message) }
        else { await sendMessage(chatId, '✅ Сон ' + hours + ' ч записан для ' + nick) }
        break
      }

      case '/mood': {
        const mood = args.slice(1).join(' ')
        if (!mood) { await sendMessage(chatId, 'Укажи настроение, например: /mood отличное'); break }
        const nick = faceitNick || 'аноним'
        const { error } = await supabase.from('mood_log').insert({
          nickname: nick, mood, recorded_at: new Date().toISOString().split('T')[0]
        })
        if (error) { await sendMessage(chatId, '❌ Ошибка: ' + error.message) }
        else { await sendMessage(chatId, '✅ Настроение «' + mood + '» записано для ' + nick) }
        break
      }

      case '/elo': {
        if (!faceitNick) { await sendMessage(chatId, 'Сначала привяжи Faceit: /link ТВОЙ_НИК'); break }
        const { data } = await supabase
          .from('elo_history')
          .select('elo')
          .eq('nickname', faceitNick)
          .order('recorded_at', { ascending: false })
          .limit(2)
        if (data && data.length > 0) {
          const current = data[0].elo
          const previous = data.length > 1 ? data[1].elo : current
          const diff = current - previous
          const emoji = diff > 0 ? '📈' : diff < 0 ? '📉' : '➡️'
          await sendMessage(chatId, `${faceitNick}: ${current} ELO ${emoji} ${diff >= 0 ? '+' : ''}${diff}\nПолная статистика: https://ufuture.ru/cabinet?nickname=${faceitNick}`)
        } else {
          await sendMessage(chatId, 'Нет данных ELO. Открой кабинет: https://ufuture.ru/cabinet?nickname=' + faceitNick)
        }
        break
      }

      case '/stats': {
        if (!faceitNick) { await sendMessage(chatId, 'Сначала привяжи Faceit: /link ТВОЙ_НИК'); break }
        const { data: sleepData } = await supabase
          .from('sleep_log')
          .select('hours')
          .eq('nickname', faceitNick)
          .order('recorded_at', { ascending: false })
          .limit(7)
        const avg = sleepData?.length
          ? (sleepData.reduce((a: number, b: any) => a + b.hours, 0) / sleepData.length).toFixed(1)
          : '—'
        await sendMessage(chatId, `${faceitNick}:\nСредний сон за 7 дней: ${avg} ч\nПолная статистика: https://ufuture.ru/cabinet?nickname=${faceitNick}`)
        break
      }

      default:
        await sendMessage(chatId, 'Команды: /start, /link, /sleep, /mood, /elo, /stats')
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
