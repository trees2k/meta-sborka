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
  if (!myNickname) return NextResponse.json({ count: 0 })

  const { count } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('to_nickname', myNickname)
    .eq('read', false)

  return NextResponse.json({ count: count || 0 })
}