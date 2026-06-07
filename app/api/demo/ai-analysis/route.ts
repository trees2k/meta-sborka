import { NextResponse } from 'next/server'

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

export async function POST(request: Request) {
  try {
    const { analysis } = await request.json()
    if (!analysis) return NextResponse.json({ error: 'analysis обязателен' }, { status: 400 })

    const s = analysis.stats
    const errors = analysis.errors || []

    const prompt = `Ты профессиональный тренер по CS2. Проанализируй статистику игрока и дай конкретные советы.

Статистика игрока:
- Никнейм: ${s.nickname}
- Карта: ${s.map}
- K/D: ${s.kd}
- ADR: ${s.adr}
- HS%: ${s.hs}%
- KAST: ${s.kast}%
- Утилита урон: ${s.utility_damage}
- Убийства: ${s.kills}, Смерти: ${s.deaths}, Ассисты: ${s.assists}
- Раундов: ${s.total_rounds}

Найденные ошибки:
${errors.map((e: any) => `- ${e.title}: ${e.sub}`).join('\n')}

Дай краткий анализ (3-4 предложения) и 3 конкретных совета как улучшить игру. Отвечай на русском языке. Будь конкретным и практичным.`

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://ufuture.ru',
        'X-Title': 'UFUTURE CS2 Coach'
      },
      body: JSON.stringify({
        model: 'nvidia/nemotron-3-ultra-550b-a55b:free',
        messages: [{ role: 'user', content: prompt }]
      })
    })

    const data = await res.json()
    const text = data.choices?.[0]?.message?.content || 'Не удалось получить анализ'
    return NextResponse.json({ analysis: text })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}