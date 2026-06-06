import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { demo_url, nickname } = await request.json()

    const url = Array.isArray(demo_url) ? demo_url[0] : demo_url

    // Vercel скачивает демку с Faceit CDN
    const demoRes = await fetch(url)
    if (!demoRes.ok) throw new Error(`Не удалось скачать демку: ${demoRes.status}`)

    const blob = await demoRes.blob()
    const filename = url.split('/').pop() || 'demo.dem.zst'

    // Отправляем на VPS
    const form = new FormData()
    form.append('file', blob, filename)
    if (nickname) form.append('nickname', nickname)

    const vpsRes = await fetch(`${process.env.VPS_URL}/analyze-errors`, {
      method: 'POST',
      body: form,
    })

    const data = await vpsRes.json()
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}