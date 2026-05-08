import { NextResponse } from 'next/server'
import https from 'https'

const VPS_URL = 'https://82.114.228.147:8000/analyze'
const agent = new https.Agent({ rejectUnauthorized: false })

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

    const vpsRes = await fetch(VPS_URL, {
      method: 'POST',
      body: vpsFormData,
      agent
    })

    const vpsData = await vpsRes.json()

    if (vpsData.status !== 'ok') {
      return NextResponse.json({ error: vpsData.detail || 'Ошибка анализа' }, { status: 500 })
    }

    return NextResponse.json({ ok: true, data: vpsData.data })
  } catch (err: any) {
    return NextResponse.json({ error: 'Ошибка при анализе: ' + err.message }, { status: 500 })
  }
}