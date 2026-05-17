import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const { highlight_id, nickname } = await request.json()

  if (!highlight_id || !nickname) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 })
  }

  // Проверяем есть ли уже лайк
  const { data: existing } = await supabase
    .from('highlight_likes')
    .select('id')
    .eq('highlight_id', highlight_id)
    .eq('nickname', nickname)
    .single()

  if (existing) {
    // Убираем лайк
    await supabase
      .from('highlight_likes')
      .delete()
      .eq('highlight_id', highlight_id)
      .eq('nickname', nickname)
    return NextResponse.json({ liked: false })
  } else {
    // Ставим лайк
    await supabase
      .from('highlight_likes')
      .insert({ highlight_id, nickname })
    return NextResponse.json({ liked: true })
  }
}