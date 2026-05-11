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
  const { error } = await supabase.from('follows').delete().eq('follower_nickname', follower).eq('followee_nickname', followee)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}