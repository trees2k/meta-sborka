import { NextResponse } from 'next/server'

const VPS_URL = 'http://178.20.208.97/analyze'

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

    const vpsRes = await fetch(VPS_URL, { method: 'POST', body: vpsFormData })
    const text = await vpsRes.text()

    console.log('VPS response status:', vpsRes.status)
    console.log('VPS response body (первые 200 символов):', text.substring(0, 200))

    let data
    try {
      data = JSON.parse(text)
    } catch {
      return NextResponse.json({
        error: 'VPS ответил не JSON. Первые 200 символов: ' + text.substring(0, 200)
      }, { status: 500 })
    }

    if (data.status !== 'ok') {
      return NextResponse.json({ error: data.detail || 'Ошибка анализа' }, { status: 500 })
    }

    return NextResponse.json({ ok: true, data: data.data })
  } catch (err: any) {
    return NextResponse.json({ error: 'Ошибка при анализе: ' + err.message }, { status: 500 })
  }
}