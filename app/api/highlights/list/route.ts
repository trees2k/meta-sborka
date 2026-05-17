import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function GET(request: Request) {
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      { error: 'Supabase env variables are missing' },
      { status: 500 }
    )
  }

  const supabase = createClient(supabaseUrl, serviceKey)

  const { searchParams } = new URL(request.url)
  const nickname = searchParams.get('nickname')

  let query = supabase
    .from('highlights')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  if (nickname) {
    query = query.ilike('nickname', nickname)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({
    ok: true,
    highlights: data || [],
  })
}