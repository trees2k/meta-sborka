import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const { highlight_id, user_nickname, text } = await request.json()
  if (!highlight_id || !user_nickname || !text) {
    return NextResponse.json({ error: 'Не все поля заполнены' }, { status: 400 })
  }
  const { error } = await supabase.from('comments').insert({ highlight_id, user_nickname, text })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const highlight_id = searchParams.get('highlight_id')
  if (!highlight_id) return NextResponse.json({ comments: [] })
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('highlight_id', highlight_id)
    .order('created_at', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ comments: data || [] })
}

