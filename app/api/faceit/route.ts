import { NextResponse } from 'next/server'

const FACEIT_API_KEY = process.env.FACEIT_API_KEY
const FACEIT_API_BASE = 'https://open.faceit.com/data/v4'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const nickname = searchParams.get('nickname')

  if (!nickname) {
    return NextResponse.json({ error: 'Nickname is required' }, { status: 400 })
  }

  try {
    const playerRes = await fetch(`${FACEIT_API_BASE}/players?nickname=${encodeURIComponent(nickname)}`, {
      headers: {
        'Authorization': `Bearer ${FACEIT_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    if (!playerRes.ok) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 })
    }

    const playerData = await playerRes.json()
    const playerId = playerData.player_id

    const statsRes = await fetch(`${FACEIT_API_BASE}/players/${playerId}/stats/cs2`, {
      headers: {
        'Authorization': `Bearer ${FACEIT_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })
    const statsData = await statsRes.json()

    return NextResponse.json({
      nickname: playerData.nickname,
      player_id: playerId,
      avatar: playerData.avatar,
      level: playerData.games?.cs2?.skill_level,
      elo: playerData.games?.cs2?.faceit_elo,
      stats: statsData
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch player data' }, { status: 500 })
  }
}
// Новый метод: получить список матчей с демками
export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url)
  const nickname = searchParams.get('nickname')

  if (!nickname) {
    return NextResponse.json({ error: 'Nickname is required' }, { status: 400 })
  }

  try {
    // 1. Получаем ID игрока
    const playerRes = await fetch(`${FACEIT_API_BASE}/players?nickname=${encodeURIComponent(nickname)}`, {
      headers: { 'Authorization': `Bearer ${FACEIT_API_KEY}` }
    })
    const playerData = await playerRes.json()
    const playerId = playerData.player_id

    // 2. Получаем историю матчей (последние 5)
    const matchesRes = await fetch(`${FACEIT_API_BASE}/players/${playerId}/history?game=cs2&limit=5`, {
      headers: { 'Authorization': `Bearer ${FACEIT_API_KEY}` }
    })
    const matchesData = await matchesRes.json()

    // 3. Для каждого матча получаем demo_url
    const matchesWithDemos = await Promise.all(
      matchesData.items.map(async (match: any) => {
        const matchRes = await fetch(`${FACEIT_API_BASE}/matches/${match.match_id}`, {
          headers: { 'Authorization': `Bearer ${FACEIT_API_KEY}` }
        })
        const matchDetail = await matchRes.json()
        return {
          match_id: match.match_id,
          demo_url: matchDetail.demo_url || null,
          played_at: match.played_at
        }
      })
    )

    return NextResponse.json({ matches: matchesWithDemos })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch demos' }, { status: 500 })
  }
}