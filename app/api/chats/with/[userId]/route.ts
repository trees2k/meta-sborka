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
 
  const { userId: slugParam } = await params
 
  try {
    // Определяем — это nickname или userId
    // UUID имеет формат xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    const isUUID = /^[0-9a-f-]{36}$/.test(slugParam)
 
    let targetUserId = slugParam
 
    if (!isUUID) {
      // Это nickname — ищем userId по faceit_nickname
      const { data: targetUser } = await supabase
        .from('users')
        .select('id')
        .eq('faceit_nickname', slugParam)
        .single()
 
      if (!targetUser) {
        return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 })
      }
      targetUserId = targetUser.id
    }
 
    if (targetUserId === currentUserId) {
      return NextResponse.json({ error: 'Нельзя написать самому себе' }, { status: 400 })
    }
 
    let user1 = currentUserId
    let user2 = targetUserId
 
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
    console.error('GET /api/chats/with error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}