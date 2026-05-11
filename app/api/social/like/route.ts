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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const highlight_id = searchParams.get('highlight_id')
  const user_nickname = searchParams.get('user_nickname') || ''

  if (!highlight_id) {
    return NextResponse.json({ error: 'highlight_id обязателен' }, { status: 400 })
  }

  // Количество лайков
  const { count } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('highlight_id', highlight_id)

  // Лайкнул ли текущий пользователь
  let liked = false
  if (user_nickname) {
    const { data } = await supabase
      .from('likes')
      .select('*')
      .eq('highlight_id', highlight_id)
      .eq('user_nickname', user_nickname)
      .limit(1)
    liked = data ? data.length > 0 : false
  }

  return NextResponse.json({ count: count || 0, liked })
}