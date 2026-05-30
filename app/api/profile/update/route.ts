import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nickname, faceit_nickname, steam_id, avatar, bio, role, rank } = body

    if (!nickname) {
      return NextResponse.json({ error: 'nickname обязателен' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('users')
      .update({
        faceit_nickname,
        steam_id,
        avatar,
        bio,
        role,
        rank,
        updated_at: new Date().toISOString(),
      })
      .eq('nickname', nickname)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true, user: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}