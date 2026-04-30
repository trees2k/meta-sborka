import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const { nickname, role, style, psychotype, goal } = await request.json()
  const { error } = await supabase.from('player_profile').upsert({
    nickname, role, style, psychotype, goal
  }, { onConflict: 'nickname' })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}