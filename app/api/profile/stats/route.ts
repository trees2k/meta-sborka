import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const nickname = searchParams.get('nickname')

  if (!nickname) {
    return NextResponse.json({ error: 'nickname обязателен' }, { status: 400 })
  }

  try {
    const { data: analyses, error } = await supabase
      .from('demo_analysis')
      .select('*')
      .eq('user_nickname', nickname)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Считаем средние показатели
    const avg = analyses && analyses.length > 0 ? {
      kd: (analyses.reduce((s, a) => s + (a.kd || 0), 0) / analyses.length).toFixed(2),
      adr: (analyses.reduce((s, a) => s + (a.adr || 0), 0) / analyses.length).toFixed(1),
      headshot_percent: (analyses.reduce((s, a) => s + (a.headshot_percent || 0), 0) / analyses.length).toFixed(1),
      kast: (analyses.reduce((s, a) => s + (a.kast || 0), 0) / analyses.length).toFixed(1),
      total_matches: analyses.length,
    } : null

    return NextResponse.json({ analyses: analyses || [], avg })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}