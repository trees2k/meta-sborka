import { NextResponse } from 'next/server'
 
const FACEIT_API_KEY = process.env.FACEIT_API_KEY
const FACEIT_API_BASE = 'https://open.faceit.com/data/v4'
 
export async function POST(request: Request) {
  try {
    const { nickname, code } = await request.json()
 
    if (!nickname || !code) {
      return NextResponse.json({ error: 'Никнейм и код обязательны' }, { status: 400 })
    }
 
    // Получаем профиль игрока с Faceit
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
 
    // Проверяем bio/about поля
    const bio = [
      player.about || '',
      player.description || '',
      player.membership || '',
      JSON.stringify(player.settings || {}),
    ].join(' ').toLowerCase()
 
    if (bio.includes(code.toLowerCase())) {
      return NextResponse.json({ ok: true })
    }
 
    // Проверяем также в cover_image_url и других полях
    const allFields = JSON.stringify(player).toLowerCase()
    if (allFields.includes(code.toLowerCase())) {
      return NextResponse.json({ ok: true })
    }
 
    return NextResponse.json({
      error: `Код "${code}" не найден в описании профиля. Убедись что добавил его в поле "About me" на Faceit и сохранил.`
    }, { status: 400 })
 
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}