import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const VPS_URL = 'https://wings-keyboards-cheaper-ahead.trycloudflare.com/analyze'
const HIGHLIGHTS_URL = 'https://wings-keyboards-cheaper-ahead.trycloudflare.com/highlights'

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('demo') as File
  const nickname = formData.get('nickname') as string

  if (!file || !nickname) {
    return NextResponse.json({ error: 'Файл и никнейм обязательны' }, { status: 400 })
  }

  try {
    const vpsFormData = new FormData()
    vpsFormData.append('file', file)

    // 1. Анализируем демку на VPS
    const vpsRes = await fetch(VPS_URL, { method: 'POST', body: vpsFormData })
    const vpsData = await vpsRes.json()

    if (vpsData.status !== 'ok') {
      return NextResponse.json({ error: vpsData.detail || 'Ошибка анализа' }, { status: 500 })
    }

    // 2. Генерируем хайлайты
    const highlightRes = await fetch(HIGHLIGHTS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickname, demo_url: vpsData.demo_url || '' })
    })
    const highlightData = await highlightRes.json()

    return NextResponse.json({
      ok: true,
      stats: vpsData.data,
      highlights: highlightData.highlights || []
    })
  } catch (err: any) {
    return NextResponse.json({ error: 'Ошибка при анализе: ' + err.message }, { status: 500 })
  }
}