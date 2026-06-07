import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { jwtVerify } from 'jose'
 
export const dynamic = 'force-dynamic'
 
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
 
export async function GET(request: Request) {
  const myNickname = await getNicknameFromCookie(request)
  if (!myNickname) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
 
  // Получаем все сообщения где я участвую
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`from_nickname.eq.${myNickname},to_nickname.eq.${myNickname}`)
    .order('created_at', { ascending: false })
 
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
 
  // Группируем по собеседнику
  const convMap: Record<string, any> = {}
  for (const msg of data || []) {
    const otherNick = msg.from_nickname === myNickname ? msg.to_nickname : msg.from_nickname
    if (!convMap[otherNick]) {
      convMap[otherNick] = {
        nickname: otherNick,
        last_message: msg.text,
        last_at: msg.created_at,
      }
    }
  }
 
  const conversations = Object.values(convMap)
    .sort((a: any, b: any) => new Date(b.last_at).getTime() - new Date(a.last_at).getTime())
 
  return NextResponse.json({ conversations })
}
 