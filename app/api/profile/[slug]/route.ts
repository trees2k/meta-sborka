import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug: nickname } = await params

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('nickname', nickname)
      .single()

    if (error || !user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 })
    }

    const { data: stats } = await supabase
      .from('demo_analysis')
      .select('*')
      .eq('user_nickname', nickname)
      .order('created_at', { ascending: false })
      .limit(10)

    return NextResponse.json({ user, stats: stats || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug: nickname } = await params
  const body = await request.json()

  try {
    const { data, error } = await supabase
      .from('users')
      .update(body)
      .eq('nickname', nickname)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ user: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}