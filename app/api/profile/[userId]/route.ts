import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params

    const { data: profile, error } = await supabase
      .from('player_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error || !profile) {
      return NextResponse.json({ error: 'Профиль не найден' }, { status: 404 })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('GET /api/profile/[userId] error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params
    const body = await request.json()

    const { data: profile, error } = await supabase
      .from('player_profiles')
      .update(body)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: 'Error updating profile' }, { status: 400 })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('PUT /api/profile/[userId] error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
