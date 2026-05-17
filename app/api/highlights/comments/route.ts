import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const highlight_id = searchParams.get('highlight_id')

  if (!highlight_id) {
    return NextResponse.json({ error: 'Missing highlight_id' }, { status: 400 })
  }

  const { data } = await supabase
    .from('highlight_comments')
    .select('*')
    .eq('highlight_id', highlight_id)
    .order('created_at', { ascending: true })

  return NextResponse.json({ comments: data || [] })
}

export async function POST(request: Request) {
  const { highlight_id, nickname, text } = await request.json()

  if (!highlight_id || !nickname || !text) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 })
  }

  const { error } = await supabase
    .from('highlight_comments')
    .insert({ highlight_id, nickname, text })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}