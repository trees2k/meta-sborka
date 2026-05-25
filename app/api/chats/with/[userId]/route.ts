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

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const currentUserId = await getUserIdFromRequest(request)
  if (!currentUserId) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  }

  const { userId: targetUserId } = params

  try {
    // Найти существующий чат или создать новый
    let user1 = currentUserId
    let user2 = targetUserId

    // Упорядочиваем ID для консистентности
    if (user1 > user2) {
      [user1, user2] = [user2, user1]
    }

    const { data: existingChat } = await supabase
      .from('chats')
      .select('*')
      .eq('user1_id', user1)
      .eq('user2_id', user2)
      .single()

    let chat = existingChat

    if (!existingChat) {
      const { data: newChat, error } = await supabase
        .from('chats')
        .insert({ user1_id: user1, user2_id: user2 })
        .select()
        .single()

      if (error) throw error
      chat = newChat
    }

    return NextResponse.json({ chat })
  } catch (error) {
    console.error('GET /api/chats/with/[userId] error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
