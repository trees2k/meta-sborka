import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const { follower_nickname, following_nickname } = await request.json()
  const { error } = await supabase.from('follows').insert({ follower_nickname, following_nickname })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(request: Request) {
  const { follower_nickname, following_nickname } = await request.json()
  const { error } = await supabase.from('follows').delete().eq('follower_nickname', follower_nickname).eq('following_nickname', following_nickname)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const nickname = searchParams.get('nickname')
  const type = searchParams.get('type') || 'following'
  if (!nickname) return NextResponse.json({ error: 'nickname required' }, { status: 400 })
  const column = type === 'followers' ? 'following_nickname' : 'follower_nickname'
  const filterColumn = type === 'followers' ? 'follower_nickname' : 'following_nickname'
  const { data, error } = await supabase.from('follows').select('*').eq(filterColumn, nickname)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ count: data.length, list: data.map((d: any) => d[column]) })
}