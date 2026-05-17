import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { highlights } = await request.json()

    if (!highlights || !Array.isArray(highlights) || highlights.length === 0) {
      return NextResponse.json({ ok: true, saved: 0 })
    }

    const { error } = await supabase.from('highlights').insert(highlights)

    if (error) {
      console.error('[HIGHLIGHTS SAVE]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, saved: highlights.length })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}