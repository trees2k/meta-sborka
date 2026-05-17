import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function POST(request: Request) {
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      { error: 'Supabase env variables are missing' },
      { status: 500 }
    )
  }

  const supabase = createClient(supabaseUrl, serviceKey)

  try {
    const body = await request.json()

    const nickname = body.nickname
    const demoId = body.demo_id
    const moments = body.moments || []

    if (!nickname) {
      return NextResponse.json(
        { error: 'nickname is required' },
        { status: 400 }
      )
    }

    if (!Array.isArray(moments) || moments.length === 0) {
      return NextResponse.json({
        ok: true,
        highlights: [],
        message: 'No highlight moments found',
      })
    }

    const rows = moments.map((moment: any) => ({
      nickname,
      author_name: nickname,
      map_name: moment.map_name || null,

      title: moment.title,
      description: moment.description,
      highlight_type: moment.highlight_type,

      round_number: moment.round_number || null,
      kills: moment.kills || 0,
      damage: moment.damage || 0,
      score: moment.score || 0,

      video_url: moment.video_url || null,
      thumbnail_url: moment.thumbnail_url || null,

      demo_id: demoId || null,
      stats: moment.stats || {},
      raw: moment.raw || {},
    }))

    const { data, error } = await supabase
      .from('highlights')
      .insert(rows)
      .select('*')

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
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}