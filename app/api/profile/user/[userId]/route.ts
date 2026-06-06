import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
 
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
 
export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params
 
  const { data, error } = await supabase
    .from('users')
    .select('faceit_nickname, email')
    .eq('id', userId)
    .single()
 
  if (error || !data) {
    return NextResponse.json({ nickname: null }, { status: 404 })
  }
 
  return NextResponse.json({
    nickname: data.faceit_nickname || null,
    faceit_nickname: data.faceit_nickname || null,
  })
}
 