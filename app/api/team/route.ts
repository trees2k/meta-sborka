import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { jwtVerify } from 'jose'
 
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const JWT_SECRET = new TextEncoder().encode(process.env.SUPABASE_SERVICE_ROLE_KEY || 'fallback-secret')
 
async function getNicknameFromCookie(request: Request) {
  const cookie = request.headers.get('cookie') || ''
  const tokenMatch = cookie.match(/token=([^;]+)/)
  if (!tokenMatch) return null
  try {
    const { payload } = await jwtVerify(tokenMatch[1], JWT_SECRET)
    const userId = payload.userId as string
    const { data } = await supabase.from('users').select('faceit_nickname').eq('id', userId).single()
    return data?.faceit_nickname || null
  } catch {
    return null
  }
}
 
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const nickname = searchParams.get('nickname')
  if (!nickname) return NextResponse.json({ data: null })
 
  const { data } = await supabase
    .from('player_profile')
    .select('*')
    .eq('nickname', nickname)
    .single()
 
  return NextResponse.json({ data: data || null })
}
 
export async function POST(request: Request) {
  try {
    const nickname = await getNicknameFromCookie(request)
    if (!nickname) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
 
    const { role, style, psychotype, goal } = await request.json()
    if (!role || !style || !psychotype || !goal) {
      return NextResponse.json({ error: 'Заполни все поля' }, { status: 400 })
    }
 
    const FACEIT_API_KEY = process.env.FACEIT_API_KEY
    let faceit_elo = 1000
    try {
      const res = await fetch(`https://open.faceit.com/data/v4/players?nickname=${encodeURIComponent(nickname)}`, {
        headers: { 'Authorization': `Bearer ${FACEIT_API_KEY}` }
      })
      const data = await res.json()
      faceit_elo = data.games?.cs2?.faceit_elo || 1000
    } catch {}
 
    const { error: upsertError } = await supabase.from('player_profile').upsert({
      nickname,
      role,
      style,
      psychotype,
      goal,
      faceit_elo,
    }, { onConflict: 'nickname' })
 
    if (upsertError) {
      console.error('Upsert error:', upsertError)
      return NextResponse.json({ error: upsertError.message }, { status: 500 })
    }
 
    const { data: allPlayers } = await supabase
      .from('player_profile')
      .select('*')
      .neq('nickname', nickname)
      .gte('faceit_elo', faceit_elo - 400)
      .lte('faceit_elo', faceit_elo + 400)
 
    if (!allPlayers || allPlayers.length === 0) {
      return NextResponse.json({ ok: true, matches: [] })
    }
 
    const scored = allPlayers.map(p => {
      let score = 0
      if (p.style === style) score += 30
      if (p.psychotype === psychotype) score += 25
      if (p.goal === goal) score += 20
      if (p.role !== role) score += 15
      const eloDiff = Math.abs(p.faceit_elo - faceit_elo)
      score += Math.max(0, 10 - Math.floor(eloDiff / 50))
      return { ...p, score }
    })
 
    const matches = scored.sort((a, b) => b.score - a.score).slice(0, 5)
    return NextResponse.json({ ok: true, matches })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}