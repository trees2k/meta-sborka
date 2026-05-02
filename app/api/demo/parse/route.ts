import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('demo') as File
  const nickname = formData.get('nickname') as string

  if (!file || !nickname) {
    return NextResponse.json({ error: 'Файл и никнейм обязательны' }, { status: 400 })
  }

  // Пока парсер недоступен, генерируем тестовые метрики
  const stats = {
    reactionAvg: Math.floor(Math.random() * 100 + 150),
    accuracyHead: Math.floor(Math.random() * 30 + 40),
    accuracyBody: Math.floor(Math.random() * 30 + 20),
    sprayDeviation: Math.floor(Math.random() * 10 + 5),
    utilityDamage: Math.floor(Math.random() * 100),
    flashSuccessRate: Math.floor(Math.random() * 50 + 30),
    positioningScore: Math.floor(Math.random() * 40 + 50),
    timingScore: Math.floor(Math.random() * 40 + 50)
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

  return NextResponse.json({ ok: true, stats })
}