import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { jwtVerify } from 'jose'

export const dynamic = 'force-dynamic'

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

export async function GET(request: Request) {
  try {
    const userId = await getUserIdFromCookie(request)
    if (!userId) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error || !user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('GET /api/auth/me error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
