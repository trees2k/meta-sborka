import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const { from_nickname, to_nickname, text } = await request.json()
  const { error } = await supabase.from('messages').insert({ from_nickname, to_nickname, text })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const user1 = searchParams.get('user1')
  const user2 = searchParams.get('user2')
  if (!user1 || !user2) return NextResponse.json({ error: 'user1 and user2 required' }, { status: 400 })
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`and(from_nickname.eq.${user1},to_nickname.eq.${user2}),and(from_nickname.eq.${user2},to_nickname.eq.${user1})`)
    .order('created_at', { ascending: true })
    .limit(50)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

