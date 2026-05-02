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

  // Здесь будет реальный парсинг, когда мы подключим cs-demo-analyzer
  // Пока возвращаем расширенный набор метрик (заглушки с вариативностью)
  const stats = {
    reactionAvg: Math.floor(Math.random() * 80 + 180),        // 180-260 мс
    accuracyHead: Math.floor(Math.random() * 20 + 30),        // 30-50%
    accuracyBody: Math.floor(Math.random() * 25 + 25),        // 25-50%
    sprayDeviation: Math.floor(Math.random() * 10 + 5),       // 5-15 пикселей
    utilityDamage: Math.floor(Math.random() * 150 + 50),      // 50-200
    flashSuccessRate: Math.floor(Math.random() * 40 + 30),    // 30-70%
    positioningScore: Math.floor(Math.random() * 30 + 50),    // 50-80
    timingScore: Math.floor(Math.random() * 30 + 50),         // 50-80
    clutchWins: Math.floor(Math.random() * 3),                // 0-2
    totalKills: Math.floor(Math.random() * 20 + 10),          // 10-30
    totalDeaths: Math.floor(Math.random() * 15 + 10),         // 10-25
    adr: Math.floor(Math.random() * 40 + 60),                 // 60-100
    kdRatio: (Math.random() * 1.5 + 0.8).toFixed(2)          // 0.8-2.3
  }

  // Сохраняем в Supabase
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