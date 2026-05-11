import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const { follower, followee } = await request.json()
  if (!follower || !followee) {
    return NextResponse.json({ error: 'follower и followee обязательны' }, { status: 400 })
  }
  const { error } = await supabase.from('follows').upsert({ follower_nickname: follower, followee_nickname: followee })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(request: Request) {
  const { follower, followee } = await request.json()
  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower_nickname', follower)
    .eq('followee_nickname', followee)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const follower = searchParams.get('follower')
  const followee = searchParams.get('followee')

  // Статус подписки (подписан ли follower на followee)
  if (follower && followee) {
    const { data } = await supabase
      .from('follows')
      .select('*')
      .eq('follower_nickname', follower)
      .eq('followee_nickname', followee)
      .limit(1)
    return NextResponse.json({ following: data && data.length > 0 })
  }

  // Количество подписчиков (кто подписан на followee)
  if (followee && !follower) {
    const { count } = await supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('followee_nickname', followee)
    return NextResponse.json({ count: count || 0 })
  }

  // Количество подписок (на кого подписан follower)
  if (follower && !followee) {
    const { count } = await supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('follower_nickname', follower)
    return NextResponse.json({ count: count || 0 })
  }

  return NextResponse.json({ error: 'Укажите follower и/или followee' }, { status: 400 })
}