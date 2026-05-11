import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  request: Request,
  { params }: { params: Promise<{ nickname: string }> }
) {
  const { nickname } = await params
  // Ищем пользователя с таким faceit_nickname
  const { data, error } = await supabase
    .from('users')
    .select('bio')
    .eq('faceit_nickname', nickname)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 — не найдено
    return NextResponse.json({ bio: '' })
  }

  return NextResponse.json({ bio: data?.bio || '' })
}