import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { jwtVerify } from 'jose'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const JWT_SECRET = new TextEncoder().encode(process.env.SUPABASE_SERVICE_ROLE_KEY || 'fallback-secret')

async function getUserIdFromCookie(request: Request) {
  const cookie = request.headers.get('cookie') || ''
  const tokenMatch = cookie.match(/token=([^;]+)/)
  if (!tokenMatch) return null
  try {
    const { payload } = await jwtVerify(tokenMatch[1], JWT_SECRET)
    return payload.userId as string
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  const userId = await getUserIdFromCookie(request)
  if (!userId) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

  const { followee } = await request.json()
  if (!followee) return NextResponse.json({ error: 'followee обязателен' }, { status: 400 })

  // Получаем никнейм текущего пользователя
  const { data: userData } = await supabase.from('users').select('faceit_nickname').eq('id', userId).single()
  if (!userData?.faceit_nickname) return NextResponse.json({ error: 'Привяжите Faceit' }, { status: 400 })

  const { error } = await supabase.from('follows').upsert({
    follower_nickname: userData.faceit_nickname,
    followee_nickname: followee
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(request: Request) {
  const userId = await getUserIdFromCookie(request)
  if (!userId) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

  const { followee } = await request.json()
  if (!followee) return NextResponse.json({ error: 'followee обязателен' }, { status: 400 })

  const { data: userData } = await supabase.from('users').select('faceit_nickname').eq('id', userId).single()
  if (!userData?.faceit_nickname) return NextResponse.json({ error: 'Привяжите Faceit' }, { status: 400 })

  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower_nickname', userData.faceit_nickname)
    .eq('followee_nickname', followee)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const followee = searchParams.get('followee')
  const follower = searchParams.get('follower')

  // Статус подписки
  if (follower && followee) {
    const { data } = await supabase
      .from('follows')
      .select('*')
      .eq('follower_nickname', follower)
      .eq('followee_nickname', followee)
      .limit(1)
    return NextResponse.json({ following: data && data.length > 0 })
  }

  // Количество подписчиков
  if (followee && !follower) {
    const { count } = await supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('followee_nickname', followee)
    return NextResponse.json({ count: count || 0 })
  }

  // Количество подписок
  if (follower && !followee) {
    const { count } = await supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('follower_nickname', follower)
    return NextResponse.json({ count: count || 0 })
  }

  return NextResponse.json({ error: 'Укажите follower и/или followee' }, { status: 400 })
}