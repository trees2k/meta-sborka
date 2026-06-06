import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { jwtVerify } from 'jose'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const JWT_SECRET = new TextEncoder().encode(process.env.SUPABASE_SERVICE_ROLE_KEY || 'fallback-secret')

async function getNicknameFromCookie(request: Request) {
  const cookie = request.headers.get('cookie') || ''
  const tokenMatch = cookie.match(/token=([^;]+)/)
  if (!tokenMatch) return null
  try {
    const { payload } = await jwtVerify(tokenMatch[1], JWT_SECRET)
    const userId = payload.userId as string
    const { data } = await supabase.from('users').select('faceit_nickname').eq('id', userId).single()
    return data?.faceit_nickname || null
  } catch {
    return null
  }
}

// GET — получить историю сообщений с конкретным пользователем
export async function GET(request: Request) {
  const myNickname = await getNicknameFromCookie(request)
  if (!myNickname) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const withNickname = searchParams.get('with')
  if (!withNickname) return NextResponse.json({ error: 'with обязателен' }, { status: 400 })

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`and(from_nickname.eq.${myNickname},to_nickname.eq.${withNickname}),and(from_nickname.eq.${withNickname},to_nickname.eq.${myNickname})`)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const messages = (data || []).map(m => ({
    ...m,
    is_mine: m.from_nickname === myNickname,
    content: m.text,
  }))

  return NextResponse.json({ messages })
}

// POST — отправить сообщение
export async function POST(request: Request) {
  const myNickname = await getNicknameFromCookie(request)
  if (!myNickname) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

  const { to_nickname, content } = await request.json()
  if (!to_nickname || !content) return NextResponse.json({ error: 'to_nickname и content обязательны' }, { status: 400 })

  const { data, error } = await supabase
    .from('messages')
    .insert({ from_nickname: myNickname, to_nickname, text: content })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ message: { ...data, is_mine: true, content: data.text } })
}