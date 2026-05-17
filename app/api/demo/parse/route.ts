import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { nickname, tunnel_url } = await request.json()

    if (!nickname || !tunnel_url) {
      return NextResponse.json(
        { error: 'nickname и tunnel_url обязательны' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      ok: true,
      upload_url: `${tunnel_url}/analyze`,
      nickname,
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}