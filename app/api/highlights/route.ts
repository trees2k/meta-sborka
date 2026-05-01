import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const { nickname, title, video_url, map_name, type, elo_snapshot } = await request.json()
  const { error } = await supabase.from('highlights').insert({
    nickname, title, video_url, map_name, type, elo_snapshot
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const nickname = searchParams.get('nickname')
  if (!nickname) return NextResponse.json({ error: 'nickname required' }, { status: 400 })
  const { data, error } = await supabase
    .from('highlights')
    .select('*')
    .eq('nickname', nickname)
    .order('created_at', { ascending: false })
    .limit(20)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
