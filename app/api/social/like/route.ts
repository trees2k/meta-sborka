import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const { user_nickname, highlight_id } = await request.json()
  if (!user_nickname || !highlight_id) {
    return NextResponse.json({ error: 'user_nickname и highlight_id обязательны' }, { status: 400 })
  }
  const { error } = await supabase.from('likes').upsert({ user_nickname, highlight_id })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(request: Request) {
  const { user_nickname, highlight_id } = await request.json()
  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('user_nickname', user_nickname)
    .eq('highlight_id', highlight_id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}