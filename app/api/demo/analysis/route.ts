import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const nickname = formData.get('nickname') as string | null

    if (!file) {
      return NextResponse.json({ error: 'Файл не передан' }, { status: 400 })
    }

    const vpsUrl = process.env.VPS_URL || ''

    const vpsForm = new FormData()
    vpsForm.append('file', file)
    if (nickname) {
      vpsForm.append('nickname', nickname)
    }

    const res = await fetch(`${vpsUrl}/analyze-errors`, {
      method: 'POST',
      body: vpsForm,
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: text }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}