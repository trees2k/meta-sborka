import { NextResponse } from 'next/server'

const FACEIT_API_KEY = process.env.FACEIT_API_KEY
const FACEIT_API_BASE = 'https://open.faceit.com/data/v4'

export async function POST(request: Request) {
  try {
    const { nickname, steamId } = await request.json()

    if (!nickname || !steamId) {
      return NextResponse.json({ error: 'Никнейм и Steam ID обязательны' }, { status: 400 })
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

    const faceitSteamId = player.steam_id_64 || player.new_steam_id || ''

    if (!faceitSteamId) {
      return NextResponse.json({ error: 'У этого Faceit аккаунта не привязан Steam' }, { status: 400 })
    }

    const inputSteamId = steamId.trim().replace(/\s/g, '')
    if (faceitSteamId === inputSteamId) {
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({
      error: `Steam ID не совпадает. Убедись что вводишь правильный Steam ID64 (17 цифр)`
    }, { status: 400 })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}