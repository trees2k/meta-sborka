import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { jwtVerify } from 'jose'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const JWT_SECRET = new TextEncoder().encode(process.env.SUPABASE_SERVICE_ROLE_KEY || 'fallback-secret')

export async function GET(request: Request) {
  const cookie = request.headers.get('cookie') || ''
  const tokenMatch = cookie.match(/token=([^;]+)/)
  if (!tokenMatch) return NextResponse.json({ user: null }, { status: 401 })

  try {
    const { payload } = await jwtVerify(tokenMatch[1], JWT_SECRET)
    const { data: users } = await supabase
      .from('users')
      .select('id, email, faceit_nickname')
      .eq('id', payload.userId)
      .limit(1)

    if (!users || users.length === 0) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    return NextResponse.json({ user: users[0] })
  } catch {
    return NextResponse.json({ user: null }, { status: 401 })
  }
}