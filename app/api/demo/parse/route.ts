import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const VPS_URL = process.env.VPS_URL || ''

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('demo') as File
  const nickname = formData.get('nickname') as string
  const userId = formData.get('user_id') as string

  if (!file || !nickname) {
    return NextResponse.json(
      { error: 'Файл и никнейм обязательны' },
      { status: 400 }
    )
  }

  try {
    // 1. Отправляем демку на VPS
    const vpsFormData = new FormData()
    vpsFormData.append('file', file)

    const vpsRes = await fetch(`${VPS_URL}/analyze`, {
      method: 'POST',
      body: vpsFormData,
    })
    const vpsData = await vpsRes.json()

    if (vpsData.status !== 'ok') {
      return NextResponse.json(
        { error: vpsData.detail || 'Ошибка анализа' },
        { status: 500 }
      )
    }

    // 2. Ищем статистику игрока по нику
    const players = vpsData.data?.players || {}
    let playerStats = null

    for (const [steamId, player] of Object.entries(players) as any) {
      if (player.name === nickname) {
        playerStats = {
          steam_id: steamId,
          name: player.name,
          kills: player.killCount,
          deaths: player.deathCount,
          assists: player.assistCount,
          kd: player.killDeathRatio,
          kast: player.kast,
          headshot_percent: player.headshotPercent,
          adr: Math.round(player.healthDamage / 
            (vpsData.data?.rounds?.length || 1)),
          mvps: player.mvpCount,
          score: player.score,
        }
        break
      }
    }

    // 3. Сохраняем в Supabase
    if (userId && playerStats) {
      await supabase.from('demo_analyses').insert({
        user_id: userId,
        nickname: nickname,
        demo_id: vpsData.demo_id,
        map: vpsData.data?.mapName || 'unknown',
        kills: playerStats.kills,
        deaths: playerStats.deaths,
        assists: playerStats.assists,
        kd: playerStats.kd,
        kast: playerStats.kast,
        headshot_percent: playerStats.headshot_percent,
        adr: playerStats.adr,
        result: JSON.stringify(playerStats),
        created_at: new Date().toISOString(),
      })
    }

    return NextResponse.json({
      ok: true,
      stats: playerStats,
      map: vpsData.data?.mapName,
      all_players: Object.values(players).map((p: any) => ({
        name: p.name,
        kills: p.killCount,
        deaths: p.deathCount,
        kd: p.killDeathRatio,
      })),
    })
  } catch (err: any) {
    console.error('[ANALYZE ERROR]', err)
    return NextResponse.json(
      { error: 'Ошибка при анализе: ' + err.message },
      { status: 500 }
    )
  }
}