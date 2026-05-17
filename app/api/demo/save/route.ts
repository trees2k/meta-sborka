import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.nickname) {
      return NextResponse.json({ error: 'Nickname обязателен' }, { status: 400 })
    }

    const { error } = await supabase.from('demo_analyses').insert({
      nickname: body.nickname,
      map: body.map || 'unknown',
      kills: body.kills || 0,
      deaths: body.deaths || 0,
      assists: body.assists || 0,
      kd: body.kd || 0,
      adr: body.adr || 0,
      kast: body.kast || 0,
      headshot_percent: body.headshotPercent || 0,
      headshot_count: body.headshotCount || 0,
      utility_damage: body.utilityDamage || 0,
      mvps: body.mvps || 0,
      score: body.score || 0,
      clutch_1v1: body.clutch1v1Won || 0,
      clutch_1v2_plus: (body.clutch1v2Won || 0) + (body.clutch1v3Won || 0) + (body.clutch1v4Won || 0) + (body.clutch1v5Won || 0),
    })

    if (error) {
      console.error('[SAVE ERROR]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}