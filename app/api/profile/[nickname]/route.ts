import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  request: Request,
  { params }: { params: Promise<{ nickname: string }> }
) {
  const { nickname } = await params
  const { data } = await supabase.from('profiles').select('bio').eq('nickname', nickname).single()
  return NextResponse.json({ bio: data?.bio || '' })
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ nickname: string }> }
) {
  const { nickname } = await params
  const { bio } = await request.json()
  const { error } = await supabase.from('profiles').upsert({ nickname, bio }, { onConflict: 'nickname' })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}