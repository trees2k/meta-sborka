import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim()

  if (!q || q.length < 2) {
    return NextResponse.json({ users: [] })
  }

  const { data, error } = await supabase
    .from('users')
    .select('id, faceit_nickname')
    .ilike('faceit_nickname', `%${q}%`)
    .not('faceit_nickname', 'is', null)
    .limit(8)

  if (error) return NextResponse.json({ users: [] })

  return NextResponse.json({ users: data || [] })
}