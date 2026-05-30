import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { jwtVerify } from 'jose'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const JWT_SECRET = new TextEncoder().encode(process.env.SUPABASE_SERVICE_ROLE_KEY || 'fallback-secret')

async function getUserIdFromRequest(request: Request) {
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

export async function GET(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  const currentUserId = await getUserIdFromRequest(request)
  if (!currentUserId) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  }

  try {
    const { data: chats, error } = await supabase
      .from('chats')
      .select('*')
      .or(`user1_id.eq.${currentUserId},user2_id.eq.${currentUserId}`)
      .order('last_message_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ chats: chats || [] })
  } catch (error) {
    console.error('GET /api/chats error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}