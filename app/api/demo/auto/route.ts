import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(request: Request) {
  try {
    const { demo_url, nickname } = await request.json()

    if (!demo_url) {
      return NextResponse.json({ error: 'demo_url обязателен' }, { status: 400 })
    }

    const vpsUrl = process.env.VPS_URL || ''

    // Отправляем URL на VPS — пусть VPS сам скачивает демку
    const vpsRes = await fetch(`${vpsUrl}/analyze-by-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ demo_url, nickname }),
    })

    const data = await vpsRes.json()
    return NextResponse.json(data)

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}