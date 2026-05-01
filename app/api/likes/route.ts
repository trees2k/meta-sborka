import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const { highlight_id, nickname } = await request.json()
  const { error } = await supabase.from('likes').insert({ highlight_id, nickname })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const { count } = await supabase.from('likes').select('*', { count: 'exact' }).eq('highlight_id', highlight_id)
  return NextResponse.json({ ok: true, likes: count || 0 })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const highlight_id = searchParams.get('highlight_id')
  if (!highlight_id) return NextResponse.json({ error: 'highlight_id required' }, { status: 400 })
  const { count } = await supabase.from('likes').select('*', { count: 'exact' }).eq('highlight_id', highlight_id)
  return NextResponse.json({ likes: count || 0 })
}