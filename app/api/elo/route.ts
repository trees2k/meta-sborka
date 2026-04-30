import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { nickname, elo } = await request.json()

    if (!nickname || !elo) {
      return NextResponse.json({ error: 'nickname and elo required' }, { status: 400 })
    }

    const today = new Date().toISOString().split('T')[0]

    const { data: existing } = await supabase
      .from('elo_history')
      .select('id')
      .eq('nickname', nickname)
      .eq('recorded_at', today)
      .limit(1)

    if (existing && existing.length > 0) {
      const { error } = await supabase
        .from('elo_history')
        .update({ elo })
        .eq('id', existing[0].id)
      if (error) throw error
    } else {
      const { error } = await supabase
        .from('elo_history')
        .insert({ nickname, elo, recorded_at: today })
      if (error) throw error
    }

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('ELO save error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const nickname = searchParams.get('nickname')

  if (!nickname) {
    return NextResponse.json({ error: 'nickname required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('elo_history')
    .select('elo, recorded_at')
    .eq('nickname', nickname)
    .order('recorded_at', { ascending: true })
    .limit(30)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}