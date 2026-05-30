import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    const { data: highlights, error } = await supabase
      .from('highlights')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ highlights: highlights || [] })
  } catch (error) {
    console.error('GET /api/highlights error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { data: highlight, error } = await supabase
      .from('highlights')
      .insert(body)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ highlight }, { status: 201 })
  } catch (error) {
    console.error('POST /api/highlights error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
