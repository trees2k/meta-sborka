import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

export async function POST(request: Request) {
  try {
    const { demo_url, nickname } = await request.json()

    if (!demo_url) {
      return NextResponse.json({ error: 'demo_url обязателен' }, { status: 400 })
    }

    const vpsUrl = process.env.VPS_URL || ''

    // Скачиваем демку с Faceit CDN
    const demoRes = await fetch(demo_url)
    if (!demoRes.ok) {
      return NextResponse.json({ error: 'Не удалось скачать демку' }, { status: 400 })
    }

    const demoBuffer = await demoRes.arrayBuffer()
    const demoBlob = new Blob([demoBuffer], { type: 'application/octet-stream' })

    // Отправляем на VPS
    const form = new FormData()
    form.append('file', demoBlob, `${nickname || 'demo'}.dem`)

    const vpsRes = await fetch(`${vpsUrl}/analyze-errors`, {
      method: 'POST',
      body: form,
    })

    const data = await vpsRes.json()
    return NextResponse.json(data)

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}