import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { jwtVerify } from 'jose'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const JWT_SECRET = new TextEncoder().encode(process.env.SUPABASE_SERVICE_ROLE_KEY || 'fallback-secret')

export async function POST(request: Request) {
  // Получаем пользователя из cookie
  const cookie = request.headers.get('cookie') || ''
  const tokenMatch = cookie.match(/token=([^;]+)/)
  if (!tokenMatch) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

  let userId: string
  try {
    const { payload } = await jwtVerify(tokenMatch[1], JWT_SECRET)
    userId = payload.userId as string
  } catch {
    return NextResponse.json({ error: 'Токен недействителен' }, { status: 401 })
  }

  const { faceit_nickname } = await request.json()
  if (!faceit_nickname) return NextResponse.json({ error: 'Никнейм обязателен' }, { status: 400 })

  const { error } = await supabase
    .from('users')
    .update({ faceit_nickname })
    .eq('id', userId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}