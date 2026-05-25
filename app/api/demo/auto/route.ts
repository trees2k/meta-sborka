import { NextResponse } from 'next/server'
import { createGunzip } from 'zlib'
import { Readable } from 'stream'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

export async function POST(request: Request) {
  try {
    const { demo_url, nickname } = await request.json()

    if (!demo_url) {
      return NextResponse.json({ error: 'demo_url обязателен' }, { status: 400 })
    }

    const vpsUrl = process.env.VPS_URL || ''

    // Скачиваем демку
    const demoRes = await fetch(demo_url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    })

    if (!demoRes.ok) {
      return NextResponse.json({ error: `Не удалось скачать демку: ${demoRes.status}` }, { status: 400 })
    }

    let demoBuffer: Buffer

    // Если файл сжат (.gz) — распаковываем
    if (demo_url.endsWith('.gz')) {
      const compressed = Buffer.from(await demoRes.arrayBuffer())
      demoBuffer = await new Promise((resolve, reject) => {
        const gunzip = createGunzip()
        const chunks: Buffer[] = []
        const readable = Readable.from(compressed)
        readable.pipe(gunzip)
        gunzip.on('data', chunk => chunks.push(chunk))
        gunzip.on('end', () => resolve(Buffer.concat(chunks)))
        gunzip.on('error', reject)
      })
    } else {
      demoBuffer = Buffer.from(await demoRes.arrayBuffer()) as Buffer
    }

    const demoBlob = new Blob([demoBuffer as unknown as ArrayBuffer], { type: 'application/octet-stream' })

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