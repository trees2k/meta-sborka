import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const nickname = searchParams.get('nickname')
  const page = parseInt(searchParams.get('page') || '0')
  const limit = 10

  let query = supabase
    .from('highlights')
    .select('*')
    .order('created_at', { ascending: false })
    .range(page * limit, (page + 1) * limit - 1)

  if (nickname) {
    query = query.eq('nickname', nickname)
  }

  const { data: highlights, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Добавляем количество лайков и комментариев
  const enriched = await Promise.all(
    (highlights || []).map(async (h: any) => {
      const { count: likes } = await supabase
        .from('highlight_likes')
        .select('*', { count: 'exact', head: true })
        .eq('highlight_id', h.id)

      const { count: comments } = await supabase
        .from('highlight_comments')
        .select('*', { count: 'exact', head: true })
        .eq('highlight_id', h.id)

      return { ...h, likes: likes || 0, comments: comments || 0 }
    })
  )

  return NextResponse.json({ highlights: enriched })
}