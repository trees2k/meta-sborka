import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const { nickname, stats } = await request.json()

  if (!nickname || !stats) {
    return NextResponse.json({ error: 'Никнейм и метрики обязательны' }, { status: 400 })
  }

  const { error } = await supabase.from('demo_analysis').insert({
    user_nickname: nickname,
    reaction_avg_ms: stats.reactionAvg,
    accuracy_head: stats.accuracyHead,
    accuracy_body: stats.accuracyBody,
    spray_deviation: stats.sprayDeviation,
    utility_damage: stats.utilityDamage,
    flash_success_rate: stats.flashSuccessRate,
    positioning_score: stats.positioningScore,
    timing_score: stats.timingScore
  })

  if (error) {
    console.error('Supabase error:', error)
    return NextResponse.json({ error: 'Ошибка сохранения' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

