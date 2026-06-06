import { NextResponse } from 'next/server'

const FACEIT_API_KEY = process.env.FACEIT_API_KEY
const FACEIT_API_BASE = 'https://open.faceit.com/data/v4'

export async function POST(request: Request) {
  try {
    const { nickname, code } = await request.json()

    if (!nickname || !code) {
      return NextResponse.json({ error: 'Никнейм и код обязательны' }, { status: 400 })
    }

    const res = await fetch(`${FACEIT_API_BASE}/players?nickname=${encodeURIComponent(nickname)}`, {
      headers: {
        'Authorization': `Bearer ${FACEIT_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Игрок не найден на Faceit' }, { status: 404 })
    }

    const player = await res.json()

    // Возвращаем все поля для отладки
    return NextResponse.json({ 
      debug: true,
      fields: Object.keys(player),
      about: player.about,
      description: player.description,
      membership: player.membership,
      faceit_url: player.faceit_url,
      cover_image: player.cover_image,
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}