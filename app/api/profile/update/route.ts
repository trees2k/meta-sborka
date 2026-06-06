import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { jwtVerify } from 'jose'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const JWT_SECRET = new TextEncoder().encode(process.env.SUPABASE_SERVICE_ROLE_KEY || 'fallback-secret')

export async function POST(request: Request) {
  try {
    const cookie = request.headers.get('cookie') || ''
    const tokenMatch = cookie.match(/token=([^;]+)/)
    if (!tokenMatch) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

    const { payload } = await jwtVerify(tokenMatch[1], JWT_SECRET)
    const userId = payload.userId as string

    const body = await request.json()
    const { faceit_nickname, faceit_verified, bio, avatar } = body

    if (!faceit_nickname) {
      return NextResponse.json({ error: 'faceit_nickname обязателен' }, { status: 400 })
    }

    const { error } = await supabase
      .from('users')
      .update({
        faceit_nickname,
        ...(faceit_verified !== undefined && { faceit_verified }),
        ...(bio !== undefined && { bio }),
        ...(avatar !== undefined && { avatar }),
      })
      .eq('id', userId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}